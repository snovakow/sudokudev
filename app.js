import { FONT, board, loadGrid, saveGrid } from "../sudokulib/board.js";
import { consoleOut, fillSolve, generateFromSeed, generateTransform, STRATEGY } from "../sudokulib/generator.js";
import { CellCandidate, Grid } from "../sudokulib/Grid.js";
import { picker, pickerDraw, pickerMarker, pixAlign } from "../sudokulib/picker.js";
import { candidates, nakedSingles, hiddenSingles } from "../sudokulib/solver.js";

const raws = [
	"v=bnPmmAeb-SI",
	'090004085010080900002390040000009008500030096900800000040008200003040010600703050'.split(''),
];
const sudokuSamples = [];
for (let rawIndex = 0; rawIndex < raws.length; rawIndex += 2) {
	const name = raws[rawIndex];
	const raw = raws[rawIndex + 1];
	const puzzle = [];
	for (let i = 0, index = 0; i < 9; i++) {
		const row = [];
		for (let j = 0; j < 9; j++, index++) {
			row[j] = raw[index];
		}
		puzzle[i] = row;
	}
	puzzle[9] = name;
	sudokuSamples.push(puzzle);
}

let selectedRow = 0;
let selectedCol = 0;
let selected = false;

const puzzleData = {
	id: 0,
	transform: null,
	grid: new Uint8Array(81),
}
Object.seal(puzzleData);

let selectPuzzleIndex = 0;

const titleHeight = 28;

const saveData = () => {
	saveGrid({
		id: puzzleData.id,
		transform: puzzleData.transform,
		grid: puzzleData.grid.join(""),
		selected,
		selectedRow,
		selectedCol
	});
};

const draw = () => {
	board.draw(selected, selectedRow, selectedCol);

	if (FONT.initialized) {
		const font = pixAlign(64 * window.devicePixelRatio) + "px " + FONT.marker;
		pickerDraw(font);
	} else {
		pickerDraw();
	}
}

{
	const urlOpenSansRegular = 'url(../snovakow/assets/fonts/Open_Sans/static/OpenSans-Regular.ttf)';
	const fontOpenSansRegular = new FontFace("REGULAR", urlOpenSansRegular);
	document.fonts.add(fontOpenSansRegular);
	fontOpenSansRegular.load();
	document.fonts.ready.then(() => {
		FONT.initialized = true;
		draw();
	});
}

let superpositionMode = 0;
const click = (event) => {
	// event.preventDefault();

	const rect = event.target.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const [row, col] = board.hitDetect(x, y, rect.width);

	if (row < 0 || col < 0) return;

	if (board.startCells[row * 9 + col].symbol !== 0) return;

	if (selected && selectedRow === row && selectedCol === col) {
		selected = false;
	} else {
		selectedRow = row;
		selectedCol = col;

		selected = true;
		if (timer && superpositionMode === 0) superimposeCandidates(true);
	}
	draw();
	saveData();
};
board.canvas.addEventListener('click', click);

const clickLocation = (event) => {
	const rect = event.target.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const sizeTotal = rect.width;

	const r = Math.floor(y / sizeTotal * 3);
	const c = Math.floor(x / sizeTotal * 3);
	return [r, c];
};

const pickerClick = (event) => {
	// event.preventDefault();

	if (!selected) return;

	const running = timer ? true : false;
	if (timer) superimposeCandidates(false);

	const [r, c] = clickLocation(event);

	const index = r * 3 + c + 1;
	const selectedIndex = selectedRow * 9 + selectedCol;
	const symbol = board.cells[selectedIndex].symbol;
	if (symbol === index) {
		const cell = board.cells[selectedIndex];
		cell.show = false;
		cell.setSymbol(0);
	} else {
		board.cells[selectedIndex].setSymbol(index);
	}

	saveData();
	draw();

	if (running) {
		fillSolve(board.cells);
		saveData();
		superimposeCandidates();
	}
};
picker.addEventListener('click', pickerClick);

const pickerMarkerClick = (event) => {
	// event.preventDefault();

	if (!selected) return;

	const running = timer ? true : false;
	if (timer) superimposeCandidates(false);

	const [r, c] = clickLocation(event);

	const symbol = r * 3 + c + 1;
	const selectedIndex = selectedRow * 9 + selectedCol;
	const cell = board.cells[selectedIndex];
	if (cell.show) {
		const had = cell.delete(symbol);
		if (!had) cell.add(symbol);
	} else {
		cell.clear();
		cell.add(symbol);
		cell.show = true;
	}

	saveData();
	draw();

	if (running) {
		fillSolve(board.cells);
		saveData();
		superimposeCandidates();
	}
};
pickerMarker.addEventListener('click', pickerMarkerClick);

const onFocus = () => {
	// console.log("onFocus");
	draw();
};
const offFocus = () => {

};
// window.addEventListener("focus", onFocus);
// window.addEventListener("blur", offFocus);

const orientationchange = (event) => {
	draw();
	console.log(event);
};
addEventListener("orientationchange", orientationchange);

board.canvas.style.position = 'absolute';
board.canvas.style.left = '50%';
board.canvas.style.touchAction = "manipulation";
picker.style.touchAction = "manipulation";
pickerMarker.style.touchAction = "manipulation";

const createSelect = (options, onChange) => {
	const select = document.createElement('select');

	for (const title of options) {
		const option = document.createElement('option');
		option.text = title;
		select.appendChild(option);
	}

	select.addEventListener('change', () => {
		onChange(select);
	});
	document.body.appendChild(select);

	document.body.appendChild(document.createElement('br'));

	return select;
};

const loadSudoku = () => {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			const fields = xhttp.responseText.split(":");
			if (fields.length !== 3) return;

			const puzzleId = parseInt(fields[0]);
			const puzzle = fields[1];
			if (puzzle.length !== 81) return;
			const grid = fields[2];
			if (grid.length !== 81) return;

			const transform = generateTransform();
			const puzzleTransformed = generateFromSeed(puzzle, transform);
			const gridTransformed = generateFromSeed(grid, transform);

			const puzzleString = puzzleTransformed.join("");
			board.cells.fromString(puzzleString);
			for (const cell of board.cells) {
				cell.show = false;
				const startCell = board.startCells[cell.index];
				startCell.symbol = cell.symbol;
			}

			puzzleData.id = puzzleId;
			puzzleData.transform = transform;
			puzzleData.grid = gridTransformed;

			saveData();
			draw();
		}
	};
	const uid = performance.now().toString() + Math.random().toString();
	const search = window.location.search ? window.location.search : "?table=puzzles1&strategy=hidden4&uid=" + uid;
	xhttp.open("GET", "../sudokulib/sudoku.php" + search, true);
	xhttp.send();
};

const names = [];
for (const sudoku of sudokuSamples) names.push(sudoku[9]);

const selector = createSelect(["-", ...names], (select) => {
	if (select.selectedIndex === 0) {
		loadSudoku();
		return;
	}

	selected = false;

	const index = select.selectedIndex - 1;
	board.setGrid(index < sudokuSamples.length ? sudokuSamples[index] : sudokuSamples[index - sudokuSamples.length]);

	const grid = new Uint8Array(81);
	for (let i = 0; i < 81; i++)grid[i] = board.cells[i].symbol;
	puzzleData.id = select.selectedIndex;
	puzzleData.transform = null;
	puzzleData.grid = grid;

	saveData();
	draw();
});
selector.style.position = 'absolute';
selector.style.top = titleHeight / 2 + 'px';
selector.style.left = '8px';
selector.style.transform = 'translateY(-50%)';

let loaded = false;
if (window.name) {
	const metadata = loadGrid();
	if (metadata) {
		if (metadata.selected !== undefined) selected = metadata.selected;
		if (metadata.selectedRow !== undefined) selectedRow = metadata.selectedRow;
		if (metadata.selectedCol !== undefined) selectedCol = metadata.selectedCol;

		if (metadata.id !== undefined) puzzleData.id = metadata.id;
		if (metadata.transform !== undefined) puzzleData.transform = metadata.transform;
		if (metadata.grid !== undefined) puzzleData.grid.set(metadata.grid);

		if (puzzleData.transform) {
			selector.selectedIndex = 0;
		} else {
			selector.selectedIndex = metadata.id;
		}

		loaded = true;
	}
	draw();
}
if (!loaded) {
	loadSudoku();
}

const clearButton = document.createElement('button');
clearButton.appendChild(document.createTextNode("X"));
clearButton.style.position = 'absolute';
clearButton.style.width = '32px';
clearButton.style.height = '32px';
clearButton.addEventListener('click', () => {
	selected = false;
	board.resetGrid();
	saveData();
	draw();
});
document.body.appendChild(clearButton);

const candidateButton = document.createElement('button');
candidateButton.appendChild(document.createTextNode("x"));
candidateButton.style.position = 'absolute';
candidateButton.style.width = '32px';
candidateButton.style.height = '32px';

candidateButton.addEventListener('click', () => {
	for (const cell of board.cells) {
		cell.show = true;
	}

	const now = performance.now();

	const result = fillSolve(board.cells);
	console.log("----- " + (performance.now() - now) / 1000);
	for (const line of consoleOut(result)) console.log(line);

	draw();
	saveData();
});
document.body.appendChild(candidateButton);

const superimposeCandidates = (reset = false) => {
	if (timer) {
		window.clearInterval(timer);
		board.cells.fromData(startBoard);
		draw();
		timer = 0;
		if (!reset) return;
	}
	if (!selected && superpositionMode === 0) return;

	for (const cell of board.cells) {
		cell.show = true;
	}

	const solve = (cells) => {
		let progress = false;
		do {
			candidates(cells);

			progress = nakedSingles(cells);
			if (progress) continue;

			progress = hiddenSingles(cells);
		} while (progress);
	};

	startBoard = board.cells.toData();

	let flips;
	if (superpositionMode === 0) {
		const union = new Grid();
		for (const index of Grid.indices) union[index] = new CellCandidate(index);
		for (let index = 0; index < 81; index++) {
			const startCell = startBoard[index];
			const unionCell = union[index];
			if (startCell.symbol === 0) {
				unionCell.clear();
			} else {
				unionCell.setSymbol(startCell.symbol);
			}
		}

		const superCell = board.cells[selectedRow * 9 + selectedCol];
		if (superCell.symbol !== 0) return;

		const supers = [];

		for (let x = 1; x <= 9; x++) {
			if (superCell.has(x)) {
				// cell.delete(x);
				superCell.setSymbol(x);
				solve(board.cells);
				supers.push(board.cells.toData());
				board.cells.fromData(startBoard);
			}
		}

		if (supers.length < 2) return;

		for (let index = 0; index < 81; index++) {
			const unionCell = union[index];
			if (unionCell.symbol !== 0) continue;

			for (const solution of supers) {
				const solutionCell = solution[index];
				if (solutionCell.symbol === 0) {
					for (let x = 1; x <= 9; x++) {
						if (((solutionCell.mask >> x) & 0x0001) === 0x0001) {
							unionCell.add(x)
						}
					}
				} else {
					unionCell.add(solutionCell.symbol)
				}
			}
		}

		flips = [startBoard, union.toData()];
	} else if (superpositionMode === 1) {
		const intersection = new Grid();
		for (const index of Grid.indices) intersection[index] = new CellCandidate(index);
		for (let index = 0; index < 81; index++) {
			const startCell = startBoard[index];
			const intersectionCell = intersection[index];
			if (startCell.symbol === 0) {
				intersectionCell.setSymbol(0);
			} else {
				intersectionCell.setSymbol(startCell.symbol);
			}
		}

		for (let index = 0; index < 81; index++) {
			const cell = board.cells[index];
			if (cell.symbol !== 0) continue;

			const union = new Grid();
			for (const index of Grid.indices) union[index] = new CellCandidate(index);
			for (let index = 0; index < 81; index++) {
				const startCell = startBoard[index];
				const unionCell = union[index];
				if (startCell.symbol === 0) {
					unionCell.clear();
				} else {
					unionCell.setSymbol(startCell.symbol);
				}
			}

			const supers = [];
			for (let x = 1; x <= 9; x++) {
				if (!cell.has(x)) continue;

				cell.setSymbol(x);
				solve(board.cells);
				supers.push(board.cells.toData());
				board.cells.fromData(startBoard);
			}
			if (supers.length < 2) continue;

			for (let index = 0; index < 81; index++) {
				const unionCell = union[index];
				if (unionCell.symbol !== 0) continue;

				for (const solution of supers) {
					const solutionCell = solution[index];
					if (solutionCell.symbol === 0) {
						for (let symbol = 1; symbol <= 9; symbol++) {
							if (((solutionCell.mask >> symbol) & 0x0001) === 0x0001) {
								unionCell.add(symbol)
							}
						}
					} else {
						unionCell.add(solutionCell.symbol)
					}
				}
			}

			for (let index = 0; index < 81; index++) {
				const unionCell = union[index];
				const intersectionCell = intersection[index];
				if (unionCell.symbol === 0) {
					for (let symbol = 1; symbol <= 9; symbol++) {
						if (!unionCell.has(symbol)) {
							intersectionCell.delete(symbol);
						}
					}
				} else {
					// intersectionCell.setSymbol(unionCell.symbol);
				}
			}
		}

		flips = [startBoard, intersection.toData()];
	} else if (superpositionMode === 2) {
		const intersection = new Grid();
		for (const index of Grid.indices) intersection[index] = new CellCandidate(index);
		for (let index = 0; index < 81; index++) {
			const startCell = startBoard[index];
			const intersectionCell = intersection[index];
			if (startCell.symbol === 0) {
				intersectionCell.setSymbol(0);
			} else {
				intersectionCell.setSymbol(startCell.symbol);
			}
		}

		for (const group of Grid.groupTypes) {
			for (let x = 1; x <= 9; x++) {
				const union = new Grid();
				for (const index of Grid.indices) union[index] = new CellCandidate(index);
				for (let index = 0; index < 81; index++) {
					const startCell = startBoard[index];
					const unionCell = union[index];
					if (startCell.symbol === 0) {
						unionCell.clear();
					} else {
						unionCell.setSymbol(startCell.symbol);
					}
				}

				const supers = [];
				for (const index of group) {
					const cell = board.cells[index];
					if (cell.symbol !== 0) continue;
					if (!cell.has(x)) continue;

					cell.setSymbol(x);
					solve(board.cells);
					supers.push(board.cells.toData());
					board.cells.fromData(startBoard);
				}

				if (supers.length < 2) continue;

				for (let index = 0; index < 81; index++) {
					const unionCell = union[index];
					if (unionCell.symbol !== 0) continue;

					for (const solution of supers) {
						const solutionCell = solution[index];
						if (solutionCell.symbol === 0) {
							for (let symbol = 1; symbol <= 9; symbol++) {
								if (((solutionCell.mask >> symbol) & 0x0001) === 0x0001) {
									unionCell.add(symbol)
								}
							}
						} else {
							unionCell.add(solutionCell.symbol)
						}
					}
				}

				for (let index = 0; index < 81; index++) {
					const unionCell = union[index];
					const intersectionCell = intersection[index];
					if (unionCell.symbol === 0) {
						for (let symbol = 1; symbol <= 9; symbol++) {
							if (!unionCell.has(symbol)) {
								intersectionCell.delete(symbol);
							}
						}
					} else {
						// intersectionCell.setSymbol(unionCell.symbol);
					}
				}
			}
		}
		flips = [startBoard, intersection.toData()];
	}

	let iteration = 0;
	timer = window.setInterval(() => {
		board.cells.fromData(flips[iteration % flips.length]);
		draw();
		board.cells.fromData(startBoard);
		iteration++;
	}, 1000 * 1 / 20);
}

let timer = 0;
let startBoard = null;
const superpositionCandidateButton = document.createElement('button');
superpositionCandidateButton.appendChild(document.createTextNode("M"));
superpositionCandidateButton.style.position = 'absolute';
superpositionCandidateButton.style.width = '32px';
superpositionCandidateButton.style.height = '32px';
superpositionCandidateButton.style.top = '0px';
superpositionCandidateButton.style.right = '80px';
superpositionCandidateButton.addEventListener('click', () => {
	superpositionMode = 0;
	superimposeCandidates();
});
document.body.appendChild(superpositionCandidateButton);

const superpositionCandidateAllButton = document.createElement('button');
superpositionCandidateAllButton.appendChild(document.createTextNode("A"));
superpositionCandidateAllButton.style.position = 'absolute';
superpositionCandidateAllButton.style.width = '32px';
superpositionCandidateAllButton.style.height = '32px';
superpositionCandidateAllButton.style.top = '0px';
superpositionCandidateAllButton.style.right = '40px';
superpositionCandidateAllButton.addEventListener('click', () => {
	superpositionMode = 1;
	superimposeCandidates();
});
document.body.appendChild(superpositionCandidateAllButton);

const superpositionSymbolButton = document.createElement('button');
superpositionSymbolButton.appendChild(document.createTextNode("S"));
superpositionSymbolButton.style.position = 'absolute';
superpositionSymbolButton.style.width = '32px';
superpositionSymbolButton.style.height = '32px';
superpositionSymbolButton.style.top = '0px';
superpositionSymbolButton.style.right = '0px';
superpositionSymbolButton.addEventListener('click', () => {
	superpositionMode = 2;
	superimposeCandidates();
});
document.body.appendChild(superpositionSymbolButton);

clearButton.style.transform = 'translateX(-50%)';
candidateButton.style.transform = 'translateX(-50%)';

document.body.style.userSelect = 'none';

document.body.appendChild(board.canvas);

document.body.appendChild(picker);
document.body.appendChild(pickerMarker);

const resize = () => {
	let width = window.innerWidth;
	let height = window.innerHeight;
	if (width - 192 > height) {
		if (width - height < 384) {
			width = width - 384;
		}
		board.canvas.style.top = '0%';
		board.canvas.style.transform = 'translate(-50%, 0%)';

		candidateButton.style.bottom = '324px';
		candidateButton.style.left = '96px';

		clearButton.style.bottom = '200px';
		clearButton.style.left = '96px';
	} else {
		if (height - width < 192) {
			board.canvas.style.top = '0%';
		} else {
			board.canvas.style.top = ((height - 192) - width) * 0.5 + 'px';
		}

		if (height - width < 384) {
			height = height - 192;
		}

		board.canvas.style.transform = 'translate(-50%, 0%)';

		candidateButton.style.bottom = '128px';
		candidateButton.style.left = '50%';

		clearButton.style.bottom = '8px';
		clearButton.style.left = '50%';
	}

	const size = Math.min(width, height);
	board.canvas.style.width = size + 'px';
	board.canvas.style.height = size + 'px';
	board.canvas.width = Math.floor(size * window.devicePixelRatio / 1) * 2;
	board.canvas.height = Math.floor(size * window.devicePixelRatio / 1) * 2;

	draw();
};
resize();

window.addEventListener('resize', resize);
