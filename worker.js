import { CellCandidate, Grid } from "../sudokulib/Grid.js";
import { sudokuGenerator, fillSolve, totalPuzzles, STRATEGY, STRATEGIES } from "../sudokulib/generator.js";

const cells = new Grid();
for (const index of Grid.indices) cells[index] = new CellCandidate(index);

let set4_2_2 = 0;

let set5_2_3 = 0;
let set5_3_2 = 0;

let set6_2_4 = 0;
let set6_3_3 = 0;
let set6_4_2 = 0;

let set7_2_5 = 0;
let set7_3_4 = 0;
let set7_4_3 = 0;
let set7_5_2 = 0;

let set8_2_6 = 0;
let set8_3_5 = 0;
let set8_4_4 = 0;
let set8_5_3 = 0;
let set8_6_2 = 0;

let set9_2_7 = 0;
let set9_3_6 = 0;
let set9_4_5 = 0;
let set9_5_4 = 0;
let set9_6_3 = 0;
let set9_7_2 = 0;

let setNaked2 = 0;
let setNaked3 = 0;
let setNaked4 = 0;
let setHidden2 = 0;
let setHidden3 = 0;
let setHidden4 = 0;

let simples = 0;

let candidates = 0;

let omissionsReduced = 0;
let yWingReduced = 0;
let xyzWingReduced = 0;
let xWingReduced = 0;
let swordfishReduced = 0;
let jellyfishReduced = 0;
let uniqueRectangleReduced = 0;
let phistomefelCount = 0;

let superpositions = 0;
let superpositionReduced = new Map();

let bruteForceFill = 0;

let maxTime = 0;
let totalTime = 0;

let puzzleString = null;
let puzzleStrings = null;

const clueCounter = new Map();

let stepMode = 0; // 1=row 2=phist
const step = () => {
	const time = performance.now();

	let mode = stepMode;
	if (puzzleString) {
		cells.fromString(puzzleString);
		mode = -1;
	}

	let id = 0;
	if (puzzleStrings) {
		const puzzleData = puzzleStrings.shift();
		if (!puzzleData) return false;
		const puzzle = puzzleData.puzzleClues;
		if (!puzzle) return false;
		id = puzzleData.id;
		cells.fromString(puzzle);
		mode = -1;
	}
	const clueCount = sudokuGenerator(cells, mode);

	const clueValue = clueCounter.get(clueCount);
	if (clueValue) {
		clueCounter.set(clueCount, clueValue + 1)
	} else {
		clueCounter.set(clueCount, 1)
	}

	const data = {
		id,
		puzzle: cells.string(),
		totalPuzzles: totalPuzzles,
		cells: cells.toData(),
		message: null
	};

	const save = cells.toData();
	const result = fillSolve(cells, STRATEGY.ALL);

	data.puzzleClues = data.puzzle;
	data.puzzleFilled = cells.string();
	data.clueCount = clueCount;

	data.simple = 0;
	data.naked2 = 0;
	data.naked3 = 0;
	data.naked4 = 0;
	data.hidden2 = 0;
	data.hidden3 = 0;
	data.hidden4 = 0;
	data.omissions = 0;
	data.yWing = 0;
	data.xyzWing = 0;
	data.xWing = 0;
	data.swordfish = 0;
	data.jellyfish = 0;
	data.uniqueRectangle = 0;
	data.phistomefel = 0;
	data.superpositions = 0;
	data.bruteForce = 0;

	const elapsed = performance.now() - time;
	if (maxTime === 0) {
		maxTime = elapsed;
	} else {
		if (elapsed > maxTime) {
			maxTime = elapsed;
		}
	}

	totalTime += elapsed;

	if (result.bruteForceFill) {
		data.bruteForce = 1;
		bruteForceFill++;
	}

	const phistomefelResult = (result.phistomefelReduced > 0 || result.phistomefelFilled > 0);

	let simple = true;
	simple &&= result.nakedSetsReduced.length === 0;
	simple &&= result.hiddenSetsReduced.length === 0;
	simple &&= result.omissionsReduced === 0;
	simple &&= result.yWingReduced === 0;
	simple &&= result.xyzWingReduced === 0;
	simple &&= result.xWingReduced === 0;
	simple &&= result.swordfishReduced === 0;
	simple &&= result.jellyfishReduced === 0;
	simple &&= result.uniqueRectangleReduced === 0;
	simple &&= result.superpositionReduced.length === 0;
	simple &&= !phistomefelResult;
	simple &&= !result.bruteForceFill;

	data.simple = simple ? 1 : 0;

	data.has_naked2 = 0;
	data.has_naked3 = 0;
	data.has_naked4 = 0;
	data.has_hidden2 = 0;
	data.has_hidden3 = 0;
	data.has_hidden4 = 0;
	data.has_omissions = 0;
	data.has_uniqueRectangle = 0;
	data.has_yWing = 0;
	data.has_xyzWing = 0;
	data.has_xWing = 0;
	data.has_swordfish = 0;
	data.has_jellyfish = 0;

	if (simple) simples++;
	else {
		if (result.nakedSetsReduced.length > 0) {
			cells.fromData(save);
			const strategyResult = fillSolve(cells, STRATEGY.NAKED, true);
			if (!strategyResult.bruteForceFill) {
				for (const set of strategyResult.nakedSetsReduced) {
					if (set.nakedSize === 2) data.has_naked2++;
					else if (set.nakedSize === 3) data.has_naked3++;
					else if (set.nakedSize === 4) data.has_naked4++;

					if (set.nakedSize === 2) setNaked2++;
					else if (set.nakedSize === 3) setNaked3++;
					else if (set.nakedSize === 4) setNaked4++;
				}
			}
		}
		if (result.hiddenSetsReduced.length > 0) {
			cells.fromData(save);
			const strategyResult = fillSolve(cells, STRATEGY.HIDDEN, true);
			if (!strategyResult.bruteForceFill) {
				for (const set of strategyResult.hiddenSetsReduced) {
					if (set.hiddenSize === 2) data.has_hidden2++;
					else if (set.hiddenSize === 3) data.has_hidden3++;
					else if (set.hiddenSize === 4) data.has_hidden4++;

					if (set.hiddenSize === 2) setHidden2++;
					else if (set.hiddenSize === 3) setHidden3++;
					else if (set.hiddenSize === 4) setHidden4++;
				}
			}
		}
		const processStrategy = (resultProperty, dataProperty, strategy) => {
			if (result[resultProperty] == 0) return;

			cells.fromData(save);
			const strategyResult = fillSolve(cells, strategy, true);
			const strategyResultValue = strategyResult[resultProperty];
			if (strategyResultValue > 0) {
				if (!strategyResult.bruteForceFill) data[dataProperty] = strategyResultValue;
			}
		}
		processStrategy('omissionsReduced', 'has_omissions', STRATEGY.INTERSECTION_REMOVAL);
		processStrategy('uniqueRectangleReduced', 'has_uniqueRectangle', STRATEGY.DEADLY_PATTERN);
		processStrategy('yWingReduced', 'has_yWing', STRATEGY.Y_WING);
		processStrategy('xyzWingReduced', 'has_xyzWing', STRATEGY.XYZ_WING);
		processStrategy('xWingReduced', 'has_xWing', STRATEGY.X_WING);
		processStrategy('swordfishReduced', 'has_swordfish', STRATEGY.SWORDFISH);
		processStrategy('jellyfishReduced', 'has_jellyfish', STRATEGY.JELLYFISH);

		const nakedHiddenSetsReduced = [...result.nakedSetsReduced, ...result.hiddenSetsReduced];
		for (const set of nakedHiddenSetsReduced) {
			if (set.max === 4 && set.nakedSize === 2) set4_2_2++;

			else if (set.max === 5 && set.nakedSize === 2) set5_2_3++;
			else if (set.max === 5 && set.nakedSize === 3) set5_3_2++;

			else if (set.max === 6 && set.nakedSize === 2) set6_2_4++;
			else if (set.max === 6 && set.nakedSize === 3) set6_3_3++;
			else if (set.max === 6 && set.nakedSize === 4) set6_4_2++;

			else if (set.max === 7 && set.nakedSize === 2) set7_2_5++;
			else if (set.max === 7 && set.nakedSize === 3) set7_3_4++;
			else if (set.max === 7 && set.nakedSize === 4) set7_4_3++;
			else if (set.max === 7 && set.nakedSize === 5) set7_5_2++;

			else if (set.max === 8 && set.nakedSize === 2) set8_2_6++;
			else if (set.max === 8 && set.nakedSize === 3) set8_3_5++;
			else if (set.max === 8 && set.nakedSize === 4) set8_4_4++;
			else if (set.max === 8 && set.nakedSize === 5) set8_5_3++;
			else if (set.max === 8 && set.nakedSize === 6) set8_6_2++;

			else if (set.max === 9 && set.nakedSize === 2) set9_2_7++;
			else if (set.max === 9 && set.nakedSize === 3) set9_3_6++;
			else if (set.max === 9 && set.nakedSize === 4) set9_4_5++;
			else if (set.max === 9 && set.nakedSize === 5) set9_5_4++;
			else if (set.max === 9 && set.nakedSize === 6) set9_6_3++;
			else if (set.max === 9 && set.nakedSize === 7) set9_7_2++;
		}

		for (const set of result.nakedSetsReduced) {
			if (set.nakedSize === 2) data.naked2++;
			else if (set.nakedSize === 3) data.naked3++;
			else if (set.nakedSize === 4) data.naked4++;
		}
		for (const set of result.hiddenSetsReduced) {
			if (set.hiddenSize === 2) data.hidden2++;
			else if (set.hiddenSize === 3) data.hidden3++;
			else if (set.hiddenSize === 4) data.hidden4++;
		}

		omissionsReduced += data.has_omissions;
		data.omissions += result.omissionsReduced;

		yWingReduced += data.has_yWing;
		data.yWing += result.yWingReduced;

		xyzWingReduced += data.has_xyzWing;
		data.xyzWing += result.xyzWingReduced;

		xWingReduced += data.has_xWing;
		data.xWing += result.xWingReduced;

		swordfishReduced += data.has_swordfish;
		data.swordfish += result.swordfishReduced;

		jellyfishReduced += data.has_jellyfish;
		data.jellyfish += result.jellyfishReduced;

		uniqueRectangleReduced += data.has_uniqueRectangle;
		data.uniqueRectangle += result.uniqueRectangleReduced;

		if (phistomefelResult) phistomefelCount++;
		if (phistomefelResult) data.phistomefel++;

		if (result.superpositionReduced.length > 0) {
			const once = new Set();
			for (const superpositionResult of result.superpositionReduced) {
				const key = superpositionResult.type + " " + superpositionResult.size;
				if (once.has(key)) continue;

				once.add(key);

				const count = superpositionReduced.get(key);
				if (count) {
					superpositionReduced.set(key, count + 1);
				} else {
					superpositionReduced.set(key, 1);
				}
			}
			superpositions++;
			data.superpositions++;
		}

		if (!result.bruteForceFill) candidates++;
	}

	const res = 10000;
	const percent = (val, total = totalPuzzles) => {
		return Math.ceil(100 * res * val / total) / res + "%";
	}

	let candidateTotal = 0;
	candidateTotal += setNaked2;
	candidateTotal += setNaked3;
	candidateTotal += setNaked4;
	candidateTotal += setHidden2;
	candidateTotal += setHidden3;
	candidateTotal += setHidden4;
	candidateTotal += omissionsReduced;
	candidateTotal += yWingReduced;
	candidateTotal += xyzWingReduced;
	candidateTotal += xWingReduced;
	candidateTotal += swordfishReduced;
	candidateTotal += jellyfishReduced;
	candidateTotal += uniqueRectangleReduced;
	candidateTotal += phistomefelCount;

	let superTotal = 0;
	for (const value of superpositionReduced.values()) {
		superTotal += value;
	}

	const printLine = (title, val, total) => {
		lines.push(title + ": " + percent(val, total) + " - " + val);
	};

	const lines = [];

	const clues = [...clueCounter.entries()];
	clues.sort((a, b) => {
		return a[0] - b[0];
	});

	lines.push("--- Clues");
	for (const clue of clues) {
		printLine(clue[0], clue[1], totalPuzzles);
	}

	if (superTotal > 0) {
		lines.push("--- Superpositions");
		const ordered = [];
		const entries = superpositionReduced.entries();
		for (const [key, value] of entries) {
			ordered.push({ key, value });
		}
		ordered.sort((a, b) => {
			return b.value - a.value;
		});
		for (const result of ordered) {
			printLine(result.key, result.value, superTotal);
		}
	}
	const setsTotal = setNaked4 + setNaked4 + setNaked4 + setHidden2 + setHidden3 + setHidden4;
	if (setsTotal > 0) {
		lines.push("--- Naked Hiddens");
		const SetOrder = class {
			constructor(key, value) {
				this.key = key;
				this.value = value;
			}
		}
		const ordered = [
			new SetOrder("set5_2_3", set5_2_3),
			new SetOrder("set4_2_2", set4_2_2),
			new SetOrder("set6_2_4", set6_2_4),
			new SetOrder("set5_3_2", set5_3_2),
			new SetOrder("set6_3_3", set6_3_3),
			new SetOrder("set6_4_2", set6_4_2),
			new SetOrder("set7_2_5", set7_2_5),
			new SetOrder("set7_3_4", set7_3_4),
			new SetOrder("set7_4_3", set7_4_3),
			new SetOrder("set7_5_2", set7_5_2),
			new SetOrder("set8_2_6", set8_2_6),
			new SetOrder("set8_3_5", set8_3_5),
			new SetOrder("set8_4_4", set8_4_4),
			new SetOrder("set8_5_3", set8_5_3),
			new SetOrder("set8_6_2", set8_6_2),
			new SetOrder("set9_2_7", set9_2_7),
			new SetOrder("set9_3_6", set9_3_6),
			new SetOrder("set9_4_5", set9_4_5),
			new SetOrder("set9_6_3", set9_6_3),
			new SetOrder("set9_7_2", set9_7_2),
			new SetOrder("set9_5_4", set9_5_4),
		];
		ordered.sort((a, b) => {
			return b.value - a.value;
		});
		for (const order of ordered) {
			printLine(order.key, order.value, setsTotal);
		}
	}
	if (candidateTotal > 0) {
		lines.push("--- Candidates");
		printLine("Naked2", setNaked2, candidateTotal);
		printLine("Naked3", setNaked3, candidateTotal);
		printLine("Naked4", setNaked4, candidateTotal);
		printLine("Hidden2", setHidden2, candidateTotal);
		printLine("Hidden3", setHidden3, candidateTotal);
		printLine("Hidden4", setHidden4, candidateTotal);

		printLine("Omissions", omissionsReduced, candidateTotal);
		printLine("UniqueRectangle", uniqueRectangleReduced, candidateTotal);
		printLine("yWing", yWingReduced, candidateTotal);
		printLine("xyzWing", xyzWingReduced, candidateTotal);
		printLine("xWing", xWingReduced, candidateTotal);
		printLine("Swordfish", swordfishReduced, candidateTotal);
		printLine("Jellyfish", jellyfishReduced, candidateTotal);
		if (mode === 2) printLine("Phistomefel", phistomefelCount, candidateTotal);
	}

	lines.push("--- Totals");
	lines.push("Simples: " + percent(simples) + " - " + simples);
	lines.push("Candidates: " + percent(candidates) + " - " + candidates);
	// lines.push("Superpositions: " + percent(superpositions) + " - " + superpositions);
	lines.push("BruteForceFill: " + percent(bruteForceFill) + " - " + bruteForceFill);
	lines.push("Time Avg: " + totalTime / 1000 / totalPuzzles + " Max: " + maxTime / 1000);
	lines.push("Puzzles: " + totalPuzzles);

	data.message = lines;

	postMessage(data);

	return true;
};

onmessage = (e) => {
	puzzleString = e.data.grid ?? null;
	stepMode = 0; // (searchParams.get("table") == "phistomefel") ? 2 : 0;
	if (e.data.grids) {
		if (!puzzleStrings) puzzleStrings = [];
		for (const data of e.data.grids) {
			puzzleStrings.push(data);
		}
	}
	while (step());
};
