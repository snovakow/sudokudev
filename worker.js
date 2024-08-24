import { CellMarker, Grid } from "../sudokulib/Grid.js";
import { sudokuGenerator, fillSolve, totalPuzzles } from "../sudokulib/generator.js";
import { REDUCE } from "../sudokulib/solver.js";

const cells = new Grid();
for (const index of Grid.indices) cells[index] = new CellMarker(index);

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

let markers = 0;

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
let totalOps = 0;

let puzzleString = null;

const clueCounter = new Map();

let running = true;

let stepMode = 0; // 1=row 2=phist
const step = (search) => {
	let time = performance.now();

	let mode = stepMode;
	if (puzzleString) {
		cells.fromString(puzzleString);
		mode = -1;
	}
	const { clueCount, operations } = sudokuGenerator(cells, mode);

	const clueValue = clueCounter.get(clueCount);
	if (clueValue) {
		clueCounter.set(clueCount, clueValue + 1)
	} else {
		clueCounter.set(clueCount, 1)
	}

	const data = {
		puzzle: cells.string(),
		totalPuzzles: totalPuzzles,
		cells: cells.toData(),
		message: null
	};

	const result = fillSolve(cells, search);

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
	totalOps += operations;

	let setsTotal = 0;

	if (result.bruteForceFill) {
		data.bruteForce = 1;
		bruteForceFill++;
	}

	const phistomefelResult = (result.phistomefelReduced > 0 || result.phistomefelFilled > 0);

	let simple = true;
	simple &&= result.nakedHiddenSetsReduced.length === 0;
	simple &&= result.bentWingsReduced.length === 0;
	simple &&= result.xWingReduced === 0;
	simple &&= result.swordfishReduced === 0;
	simple &&= result.jellyfishReduced === 0;
	simple &&= result.uniqueRectangleReduced === 0;
	simple &&= result.superpositionReduced.length === 0;
	simple &&= !phistomefelResult;
	simple &&= !result.bruteForceFill;

	data.simple = simple ? 1 : 0;

	if (simple) simples++;
	else {
		if (result.nakedHiddenSetsReduced.length > 0) {
			for (const set of result.nakedHiddenSetsReduced) {
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

				if (set.nakedSize === 2) setNaked2++;
				else if (set.nakedSize === 3) setNaked3++;
				else if (set.nakedSize === 4) setNaked4++;
				else if (set.hiddenSize === 2) setHidden2++;
				else if (set.hiddenSize === 3) setHidden3++;
				else if (set.hiddenSize === 4) setHidden4++;

				if (set.nakedSize === 2) data.naked2++;
				else if (set.nakedSize === 3) data.naked3++;
				else if (set.nakedSize === 4) data.naked4++;
				else if (set.hiddenSize === 2) data.hidden2++;
				else if (set.hiddenSize === 3) data.hidden3++;
				else if (set.hiddenSize === 4) data.hidden4++;
			}
		}
		if (result.bentWingsReduced.length > 0) {
			for (const reduced of result.bentWingsReduced) {
				if (reduced.strategy === REDUCE.Y_Wing) yWingReduced++;
				if (reduced.strategy === REDUCE.XYZ_Wing) xyzWingReduced++;

				if (reduced.strategy === REDUCE.Y_Wing) data.yWing++;
				if (reduced.strategy === REDUCE.XYZ_Wing) data.xyzWing++;
			}
		}

		xWingReduced += result.xWingReduced;
		data.xWing += result.xWingReduced;

		swordfishReduced += result.swordfishReduced;
		data.swordfish += result.swordfishReduced;

		jellyfishReduced += result.jellyfishReduced;
		data.jellyfish += result.jellyfishReduced;

		uniqueRectangleReduced += result.uniqueRectangleReduced;
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

		if (!result.bruteForceFill) markers++;
	}

	setsTotal += setNaked2;
	setsTotal += setNaked3;
	setsTotal += setNaked4;
	setsTotal += setHidden2;
	setsTotal += setHidden3;
	setsTotal += setHidden4;

	const res = 10000;
	const percent = (val, total = totalPuzzles) => {
		return Math.ceil(100 * res * val / total) / res + "%";
	}

	let markerTotal = 0;
	markerTotal += setsTotal;
	markerTotal += yWingReduced;
	markerTotal += xyzWingReduced;
	markerTotal += xWingReduced;
	markerTotal += swordfishReduced;
	markerTotal += jellyfishReduced;
	markerTotal += uniqueRectangleReduced;
	markerTotal += phistomefelCount;

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
		printLine("Naked 2", setNaked2, setsTotal);
		printLine("Naked 3", setNaked3, setsTotal);
		printLine("Naked 4", setNaked4, setsTotal);
		printLine("Hidden 2", setHidden2, setsTotal);
		printLine("Hidden 3", setHidden3, setsTotal);
		printLine("Hidden 4", setHidden4, setsTotal);
	}
	if (markerTotal > 0) {
		lines.push("--- Markers");
		printLine("NakedHiddenSet", setsTotal, markerTotal);
		printLine("yWing", yWingReduced, markerTotal);
		printLine("xyzWing", xyzWingReduced, markerTotal);
		printLine("xWing", xWingReduced, markerTotal);
		printLine("Swordfish", swordfishReduced, markerTotal);
		printLine("Jellyfish", jellyfishReduced, markerTotal);
		printLine("UniqueRectangle", uniqueRectangleReduced, markerTotal);
		printLine("Phistomefel", phistomefelCount, markerTotal);
	}

	lines.push("--- Stats");
	lines.push("Time Avg: " + totalTime / 1000 / totalPuzzles + " Max: " + maxTime / 1000);
	lines.push("Operations Avg: " + Math.round(totalOps / totalPuzzles));

	lines.push("--- Totals");
	lines.push("Simples: " + percent(simples) + " - " + simples);
	lines.push("Markers: " + percent(markers) + " - " + markers);
	lines.push("Superpositions: " + percent(superpositions) + " - " + superpositions);
	lines.push("BruteForceFill: " + percent(bruteForceFill) + " - " + bruteForceFill);
	lines.push("TotalPuzzles: " + totalPuzzles);

	data.message = lines;

	postMessage(data);
};

onmessage = (e) => {
	const search = e.data.search;
	puzzleString = e.data.grid ?? null;
	stepMode = (search === "?dbphistomefel") ? 2 : 0;
	while (running) step(search);
};
