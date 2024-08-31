import { FONT, board, loadGrid, saveGrid } from "../sudokulib/board.js";
import { consoleOut, fillSolve } from "../sudokulib/generator.js";
import { CellCandidate, Grid } from "../sudokulib/Grid.js";
import { picker, pickerDraw, pickerMarker, pixAlign } from "../sudokulib/picker.js";
import { bentWings, candidates, hiddenSingles, jellyfish, nakedSingles, NakedHiddenGroups, omissions, swordfish, uniqueRectangle, xWing } from "../sudokulib/solver.js";

const raws = [
	"Unsolvable 606",
	[
		0, 0, 0, 0, 8, 0, 4, 0, 0,
		5, 0, 0, 0, 0, 3, 0, 2, 0,
		0, 1, 0, 7, 0, 0, 0, 0, 0,
		0, 6, 0, 4, 2, 0, 0, 0, 9,
		8, 0, 0, 0, 5, 0, 0, 3, 0,
		0, 0, 7, 0, 0, 1, 0, 0, 0,
		0, 0, 2, 0, 0, 0, 8, 0, 0,
		4, 0, 0, 0, 9, 0, 0, 5, 0,
		0, 3, 0, 0, 0, 0, 0, 0, 6,
	],
	"Unsolvable 605",
	[
		0, 0, 0, 0, 0, 6, 0, 4, 0,
		0, 0, 0, 0, 7, 0, 2, 0, 0,
		0, 0, 0, 8, 0, 0, 0, 0, 5,
		5, 0, 0, 0, 2, 0, 8, 0, 0,
		0, 0, 7, 1, 0, 0, 0, 0, 6,
		0, 3, 0, 0, 0, 9, 0, 0, 0,
		0, 0, 2, 0, 5, 0, 0, 0, 7,
		0, 6, 0, 3, 0, 0, 1, 0, 0,
		9, 0, 0, 0, 0, 4, 0, 0, 0,
	],
	"Unsolvable 604",
	[
		0, 0, 0, 0, 0, 6, 0, 0, 4,
		5, 0, 0, 2, 0, 0, 0, 3, 0,
		0, 0, 1, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 9, 0, 0, 2, 0, 0,
		0, 3, 0, 0, 0, 4, 0, 8, 0,
		0, 0, 7, 0, 1, 0, 0, 0, 6,
		0, 8, 0, 1, 5, 0, 0, 0, 0,
		4, 0, 0, 0, 0, 3, 0, 0, 9,
		0, 0, 2, 0, 0, 0, 7, 0, 0,
	],
	"Unsolvable 603",
	[
		1, 4, 0, 0, 9, 0, 0, 5, 0,
		0, 0, 2, 7, 0, 0, 0, 0, 1,
		8, 0, 0, 0, 0, 6, 0, 0, 0,
		0, 0, 0, 0, 0, 2, 3, 0, 0,
		0, 0, 0, 0, 5, 0, 0, 9, 0,
		0, 0, 0, 4, 0, 0, 0, 0, 7,
		0, 6, 0, 8, 0, 0, 0, 7, 0,
		0, 0, 3, 0, 0, 1, 0, 0, 2,
		9, 0, 0, 0, 0, 0, 4, 0, 0,
	],
	"Unsolvable 602",
	[
		7, 0, 0, 4, 0, 0, 8, 0, 0,
		0, 0, 5, 0, 6, 0, 0, 0, 0,
		0, 2, 0, 0, 0, 1, 0, 0, 0,
		0, 0, 0, 0, 0, 8, 0, 0, 1,
		4, 0, 0, 7, 0, 0, 0, 3, 0,
		0, 0, 9, 0, 0, 0, 5, 0, 0,
		0, 0, 1, 0, 2, 0, 0, 0, 9,
		0, 8, 0, 0, 0, 0, 7, 0, 0,
		6, 0, 0, 0, 0, 0, 0, 4, 0,
	],
	"Unsolvable 601",
	[
		0, 2, 4, 0, 0, 1, 0, 3, 0,
		8, 0, 0, 0, 0, 0, 7, 0, 0,
		0, 0, 0, 0, 5, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 8,
		0, 9, 0, 4, 0, 0, 0, 2, 0,
		0, 1, 8, 0, 0, 3, 4, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 8, 0,
		0, 0, 3, 0, 0, 5, 1, 0, 0,
		7, 0, 0, 0, 6, 0, 0, 0, 9,
	],
	"Unsolvable 600",
	[
		0, 0, 7, 0, 6, 0, 5, 0, 0,
		0, 0, 0, 0, 0, 1, 0, 0, 7,
		0, 4, 0, 0, 0, 0, 0, 9, 0,
		0, 0, 5, 0, 7, 0, 9, 0, 0,
		0, 6, 0, 0, 0, 0, 4, 0, 0,
		9, 0, 0, 8, 0, 0, 0, 0, 3,
		1, 0, 0, 0, 0, 0, 0, 0, 2,
		0, 0, 0, 9, 0, 0, 0, 6, 0,
		2, 3, 0, 0, 4, 0, 0, 0, 0,
	],
	"Unsolvable 515",
	[
		0, 0, 7, 0, 0, 8, 0, 0, 0,
		6, 0, 0, 3, 0, 0, 0, 0, 0,
		0, 1, 0, 0, 9, 0, 0, 0, 8,
		3, 0, 0, 6, 0, 0, 0, 0, 7,
		0, 4, 0, 0, 5, 0, 9, 0, 0,
		0, 0, 8, 0, 0, 0, 0, 2, 0,
		0, 9, 0, 0, 0, 7, 1, 0, 0,
		0, 0, 0, 0, 4, 0, 0, 0, 6,
		2, 0, 0, 0, 0, 0, 0, 5, 0,
	],
	"Unsolvable 514",
	[
		0, 3, 0, 0, 1, 0, 0, 0, 9,
		0, 0, 6, 0, 0, 0, 5, 0, 0,
		1, 0, 0, 0, 0, 0, 0, 4, 0,
		4, 0, 0, 0, 0, 3, 2, 0, 0,
		0, 9, 0, 0, 7, 0, 0, 0, 8,
		0, 0, 5, 6, 0, 0, 0, 0, 0,
		8, 0, 0, 0, 0, 2, 0, 0, 3,
		0, 0, 0, 0, 9, 0, 0, 7, 0,
		0, 0, 0, 4, 0, 0, 1, 0, 0,
	],
	"Unsolvable 513",
	[
		5, 0, 0, 8, 0, 0, 0, 0, 0,
		0, 0, 4, 0, 0, 9, 1, 0, 0,
		0, 2, 0, 0, 7, 0, 0, 0, 3,
		0, 0, 8, 2, 0, 0, 7, 0, 0,
		3, 0, 0, 0, 0, 0, 0, 0, 9,
		0, 1, 0, 0, 0, 4, 0, 6, 0,
		0, 0, 7, 0, 3, 0, 6, 0, 4,
		0, 0, 0, 0, 0, 0, 0, 5, 0,
		9, 0, 0, 0, 0, 6, 0, 0, 0,
	],
	"Unsolvable 512",
	[
		0, 2, 0, 0, 0, 0, 7, 0, 0,
		0, 0, 9, 0, 0, 0, 0, 0, 5,
		8, 1, 0, 0, 0, 0, 0, 3, 0,
		0, 0, 0, 0, 1, 0, 6, 0, 0,
		7, 0, 0, 0, 0, 8, 0, 0, 0,
		0, 5, 0, 9, 0, 0, 0, 2, 0,
		0, 0, 6, 0, 0, 7, 0, 0, 4,
		0, 0, 0, 5, 0, 0, 0, 9, 0,
		1, 0, 0, 0, 3, 0, 8, 0, 0,
	],
	"Unsolvable 511",
	[
		0, 0, 0, 0, 6, 0, 0, 1, 0,
		4, 5, 0, 0, 0, 0, 3, 0, 8,
		0, 0, 7, 4, 0, 0, 9, 0, 0,
		0, 0, 2, 0, 3, 0, 0, 0, 0,
		3, 0, 0, 7, 0, 5, 0, 0, 0,
		0, 0, 0, 0, 4, 0, 6, 0, 0,
		0, 0, 4, 0, 0, 9, 7, 0, 0,
		7, 0, 9, 0, 0, 0, 0, 8, 2,
		0, 1, 0, 0, 0, 0, 0, 0, 0,
	],
	"Unsolvable 510",
	[
		3, 0, 9, 0, 0, 0, 4, 0, 1,
		0, 1, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 8, 0, 1, 0, 0, 0,
		0, 0, 0, 0, 0, 5, 3, 0, 0,
		8, 0, 0, 1, 0, 2, 0, 0, 9,
		0, 0, 6, 7, 0, 0, 8, 0, 0,
		0, 0, 0, 9, 0, 4, 0, 0, 0,
		0, 5, 0, 0, 0, 0, 0, 7, 0,
		7, 0, 2, 0, 0, 0, 9, 0, 3,
	],
	"Unsolvable 509",
	[
		2, 7, 0, 9, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 7, 0, 0, 0, 3,
		8, 0, 0, 0, 6, 3, 0, 4, 0,
		0, 0, 1, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 3, 0, 0, 5, 0,
		0, 2, 0, 0, 0, 9, 4, 6, 0,
		1, 0, 2, 0, 0, 0, 9, 0, 0,
		6, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 4, 0, 5, 0, 0, 0, 2, 0,
	],
	"Unsolvable 508",
	[
		0, 0, 5, 0, 0, 0, 0, 0, 4,
		0, 7, 0, 0, 0, 0, 2, 8, 0,
		0, 0, 3, 0, 0, 2, 9, 0, 0,
		9, 2, 0, 0, 0, 6, 3, 0, 0,
		0, 0, 4, 2, 0, 9, 0, 0, 0,
		0, 3, 0, 5, 0, 0, 0, 0, 0,
		0, 0, 1, 6, 0, 0, 0, 0, 0,
		7, 0, 0, 3, 0, 0, 1, 0, 6,
		0, 5, 2, 0, 0, 0, 0, 0, 0,
	],
	"Unsolvable 507",
	[
		0, 3, 0, 0, 0, 2, 0, 0, 0,
		0, 2, 5, 1, 0, 0, 3, 0, 0,
		0, 7, 0, 9, 0, 0, 0, 0, 0,
		0, 0, 6, 0, 1, 0, 0, 0, 8,
		0, 8, 0, 5, 0, 0, 0, 4, 0,
		0, 0, 0, 7, 0, 0, 0, 0, 0,
		0, 0, 1, 0, 0, 3, 4, 0, 0,
		2, 0, 0, 0, 0, 0, 7, 0, 1,
		0, 5, 0, 0, 0, 0, 0, 9, 0,
	],
	"v=bnPmmAeb-SI",
	[
		0, 9, 0, 0, 0, 4, 0, 8, 5,
		0, 1, 0, 0, 8, 0, 9, 0, 0,
		0, 0, 2, 3, 9, 0, 0, 4, 0,
		0, 0, 0, 0, 0, 9, 0, 0, 8,
		5, 0, 0, 0, 3, 0, 0, 9, 6,
		9, 0, 0, 8, 0, 0, 0, 0, 0,
		0, 4, 0, 0, 0, 8, 2, 0, 0,
		0, 0, 3, 0, 4, 0, 0, 1, 0,
		6, 0, 0, 7, 0, 3, 0, 5, 0,
	],
	"v=ynkkMxQPUpk",
	[
		0, 0, 5, 0, 2, 0, 6, 0, 0,
		0, 9, 0, 0, 0, 4, 0, 1, 0,
		2, 0, 0, 5, 0, 0, 0, 0, 3,
		0, 0, 6, 0, 3, 0, 0, 0, 0,
		0, 0, 0, 8, 0, 1, 0, 0, 0,
		0, 0, 0, 0, 9, 0, 4, 0, 0,
		3, 0, 0, 0, 0, 2, 0, 0, 7,
		0, 1, 0, 9, 0, 0, 0, 5, 0,
		0, 0, 4, 0, 6, 0, 8, 0, 0,
	],
	"v=Ui1hrp7rovw",
	[
		0, 0, 0, 1, 0, 2, 0, 0, 0,
		0, 6, 0, 0, 0, 0, 0, 7, 0,
		0, 0, 8, 0, 0, 0, 9, 0, 0,
		4, 0, 0, 0, 0, 0, 0, 0, 3,
		0, 5, 0, 0, 0, 7, 0, 0, 0,
		2, 0, 0, 0, 8, 0, 0, 0, 1,
		0, 0, 9, 0, 0, 0, 8, 0, 5,
		0, 7, 0, 0, 0, 0, 0, 6, 0,
		0, 0, 0, 3, 0, 4, 0, 0, 0,
	],
	"v=fjWOgJqRWZI",
	[
		0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 2, 0, 9, 0, 0, 3, 8, 0,
		0, 3, 0, 1, 0, 0, 7, 5, 0,
		0, 4, 8, 0, 2, 0, 0, 0, 0,
		0, 5, 0, 0, 0, 6, 0, 0, 0,
		7, 6, 0, 5, 0, 0, 4, 1, 0,
		4, 0, 0, 0, 0, 3, 0, 0, 0,
		2, 0, 0, 8, 4, 5, 6, 7, 0,
		0, 7, 5, 2, 0, 0, 0, 0, 0,
	],
	"v=BjOtNij7C84",
	[
		0, 0, 5, 0, 0, 0, 2, 0, 0,
		0, 9, 0, 0, 6, 0, 0, 8, 0,
		8, 0, 3, 0, 0, 0, 1, 0, 9,
		0, 0, 0, 3, 0, 9, 0, 0, 0,
		0, 4, 0, 0, 0, 0, 0, 3, 0,
		0, 0, 0, 7, 0, 4, 0, 0, 0,
		2, 0, 7, 0, 0, 0, 6, 0, 5,
		0, 5, 0, 0, 1, 0, 0, 2, 0,
		0, 0, 9, 0, 0, 0, 8, 0, 0,
	],
	"Snake",
	[6, 0, 7, 9, 0, 1, 3, 0, 0, 9, 0, 3, 0, 7, 0, 0, 0, 0, 0, 5, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 6, 8, 0, 0, 0, 2, 5, 8, 9, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 7, 9, 0, 6, 0, 0, 0, 0, 6, 0, 4, 0, 0, 7, 0, 0, 3, 0, 0, 8, 0, 0],
	"Phist Easy",
	[0, 2, 0, 0, 0, 0, 0, 8, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 2, 9, 1, 0, 0, 0, 0, 6, 2, 0, 0, 0, 9, 1, 0, 0, 4, 5, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 8, 4, 0, 0, 0, 0, 8, 9, 7, 4, 6, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 0, 0, 5, 0],
	"Phistomefel Easy",
	[0, 2, 0, 0, 0, 0, 0, 8, 0, 6, 0, 0, 0, 0, 8, 0, 2, 3, 0, 0, 0, 2, 9, 3, 6, 0, 0, 0, 0, 1, 7, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 0, 3, 0, 0, 0, 0, 9, 0, 0, 0, 2, 4, 0, 0, 0, 2, 6, 1, 0, 8, 0, 0, 5, 0, 0, 0, 0, 0, 0, 3, 0, 8, 1, 0, 0, 0, 0, 0, 5, 6],
	"Phistomefel Easy",
	[0, 0, 0, 4, 0, 0, 0, 8, 9, 7, 0, 0, 0, 8, 0, 0, 6, 0, 0, 0, 6, 7, 1, 9, 3, 0, 0, 0, 0, 7, 0, 0, 0, 4, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 3, 0, 2, 0, 0, 0, 8, 0, 0, 0, 0, 8, 0, 7, 1, 2, 0, 0, 0, 7, 0, 0, 0, 2, 0, 0, 8, 0, 6, 0, 0, 0, 0, 0, 4, 0],
	"Phist Easy",
	[0, 0, 3, 0, 5, 0, 7, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 7, 8, 3, 9, 1, 0, 4, 0, 0, 1, 0, 4, 0, 3, 0, 2, 0, 7, 4, 0, 0, 0, 5, 1, 0, 0, 0, 8, 0, 0, 7, 4, 0, 0, 0, 0, 5, 2, 9, 4, 8, 0, 0, 4, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	"Phist Easy",
	[1, 2, 0, 0, 5, 0, 0, 8, 9, 6, 8, 0, 9, 0, 0, 0, 3, 5, 0, 0, 9, 0, 8, 0, 2, 4, 0, 0, 6, 0, 0, 0, 5, 0, 0, 0, 0, 0, 8, 0, 0, 9, 0, 0, 0, 0, 0, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 0, 0, 8, 1, 0, 0, 0, 0, 0, 5, 3, 9, 3, 0, 0, 0, 0, 0, 1, 2],
	"Phist Rand 2YWing Deadly N322 H2",
	'100056080500000000064109300200000890000000000038001200402000010000070908050000060'.split(''),
	"1",
	'100050009800300000000000306009000000060010420008004090000040000007060008000508270'.split(''),
	"2",
	'003000080070001006000920000040890500000100970201000000000000002536000800000079600'.split(''),
	"3",
	'100000009095008000007200000000000200000600000370040800001004020500900034006000005'.split(''),
	"4",
	'020000009070001000409000000600040052000030060000060491300570000002300015500600070'.split(''),
	"5",
	'000400709960000001000030400010000003200560000000000090002005000301904020050070008'.split(''),
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

document.body.appendChild(picker);
document.body.appendChild(pickerMarker);

document.body.style.userSelect = 'none';

const draw = () => {
	board.draw(selected, selectedRow, selectedCol);

	const font = "100 " + pixAlign(64 * window.devicePixelRatio) + "px " + FONT;
	pickerDraw(font);
}

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

const names = [];
for (const sudoku of sudokuSamples) names.push(sudoku[9]);

const selector = createSelect(["-", ...names], (select) => {
	if (select.selectedIndex === 0) {
		for (let i = 0; i < 81; i++) {
			const cell = board.cells[i];
			cell.show = false;
			cell.setSymbol(0);
			board.startCells[i].symbol = 0;
		}
		saveGrid();
		draw();
		return;
	}

	selected = false;

	const index = select.selectedIndex - 1;
	board.setGrid(index < sudokuSamples.length ? sudokuSamples[index] : sudokuSamples[index - sudokuSamples.length]);
	saveGrid(select.selectedIndex);
	draw();
});
selector.style.position = 'absolute';
selector.style.width = '40px';

loadGrid();

document.body.appendChild(board.canvas);

let superpositionMode = 0;
const click = (event) => {
	// event.preventDefault();

	// Get the bounding rectangle of target
	const rect = event.target.getBoundingClientRect();
	// Mouse position
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

	draw();

	saveGrid(selector.selectedIndex);

	if (running) {
		fillSolve(board.cells, window.location.search);
		saveGrid();
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

	draw();

	saveGrid(selector.selectedIndex);

	if (running) {
		fillSolve(board.cells, window.location.search);
		saveGrid();
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

const clearButton = document.createElement('button');
clearButton.appendChild(document.createTextNode("X"));
clearButton.style.position = 'absolute';
clearButton.style.width = '32px';
clearButton.style.height = '32px';
clearButton.addEventListener('click', () => {
	selected = false;
	board.resetGrid();
	saveGrid();
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

	const result = fillSolve(board.cells, window.location.search);
	console.log("----- " + (performance.now() - now) / 1000);
	for (const line of consoleOut(result)) console.log(line);

	draw();
	saveGrid();
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
			if (progress) continue;

			progress = omissions(cells);
			if (progress) continue;

			// const nakedHiddenResult = new NakedHiddenGroups(cells).nakedHiddenSets();
			// if (nakedHiddenResult) {
			// 	progress = true;
			// 	continue;
			// }

			// const bentWingResults = bentWings(cells);
			// if (bentWingResults.length > 0) {
			// 	progress = true;
			// 	continue;
			// }

			// progress = xWing(cells);
			// if (progress) { continue; }

			// progress = swordfish(cells);
			// if (progress) { continue; }

			// progress = jellyfish(cells);
			// if (progress) { continue; }

			// progress = uniqueRectangle(cells);
			// if (progress) { continue; }
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

selector.style.transform = 'translateX(-50%)';
clearButton.style.transform = 'translateX(-50%)';
candidateButton.style.transform = 'translateX(-50%)';

candidateButton.style.touchAction = "manipulation";

board.canvas.style.position = 'absolute';
board.canvas.style.left = '50%';
board.canvas.style.touchAction = "manipulation";
picker.style.touchAction = "manipulation";
pickerMarker.style.touchAction = "manipulation";

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

		selector.style.bottom = '288px';
		selector.style.left = '96px';

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

		selector.style.bottom = '96px';
		selector.style.left = '50%';

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
