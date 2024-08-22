import { FONT, board } from "./board.js";
import { consoleOut, fillSolve } from "./generator.js";
import { CellMarker, Grid } from "../sudokulib/Grid.js";
import { picker, pickerDraw, pickerMarker, pixAlign } from "../sudokulib/picker.js";
import { bentWings, candidates, hiddenSingles, jellyfish, loneSingles, NakedHiddenGroups, omissions, swordfish, uniqueRectangle, xWing } from "../sudokulib/solver.js";

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
	// "20 XYZ Wing",
	// [0, 0, 0, 8, 4, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 2, 0, 9, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3, 0, 0, 0, 0, 8, 0, 0, 0, 9, 0, 6, 0, 0, 1, 0, 4, 3, 0, 0, 0, 5, 6, 0, 9, 5, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// "N5 H2 Deadly",
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 6, 0, 0, 0, 7, 0, 9, 0, 4, 0, 3, 0, 9, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 6, 3, 1, 0, 0, 0, 0, 8, 6, 0, 0, 4, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 7, 4, 0, 0, 9, 6, 0, 0, 0, 8, 0, 0, 0, 4, 0],
	// "N522 Deadly",
	// [0, 0, 0, 0, 5, 0, 7, 8, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 4, 0, 9, 0, 0, 0, 0, 1, 0, 5, 0, 7, 0, 0, 8, 0, 0, 0, 0, 0, 0, 6, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 1, 6, 9, 0, 0, 0, 2, 0, 0, 9, 3, 0, 8, 1, 0, 0, 4, 0, 2, 0, 0, 1, 0, 6, 0],
	// "N542",
	// [0, 0, 3, 0, 0, 0, 7, 8, 0, 0, 8, 6, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 8, 1, 7, 0, 0, 9, 0, 0, 3, 5, 0, 0, 0, 0, 0, 5, 0, 4, 2, 0, 0, 0, 4, 6, 0, 7, 0, 0, 0, 9, 0, 0, 0, 0, 5, 0, 0, 8, 0, 0],
	// "N5 H2",
	// [0, 0, 3, 4, 5, 0, 0, 8, 9, 0, 0, 0, 0, 2, 0, 0, 5, 0, 0, 0, 0, 0, 3, 8, 0, 0, 0, 5, 0, 0, 0, 7, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 9, 0, 6, 0, 0, 3, 0, 0, 0, 0, 8, 0, 0, 4, 0, 0, 7, 0, 2, 5, 0, 8, 0, 0, 6, 0, 9, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// "N532",
	// [0, 2, 0, 0, 0, 6, 7, 0, 0, 0, 8, 7, 2, 1, 0, 0, 0, 0, 6, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 4, 1, 0, 0, 0, 0, 3, 9, 0, 0, 0, 8, 0, 4, 8, 0, 3, 0, 6, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 5, 0, 2],
	// "P YWing",
	// [1, 2, 0, 0, 0, 0, 0, 8, 9, 0, 9, 0, 0, 0, 0, 0, 3, 5, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 9, 7, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0, 5, 0, 0, 4, 0, 0, 7, 1, 0, 8, 0, 0, 0, 5, 3, 8, 0, 0, 0, 0, 4, 0, 2, 1],
	// "P N43",
	// [0, 2, 0, 0, 5, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 9, 8, 7, 3, 0, 0, 0, 0, 2, 0, 0, 0, 9, 0, 3, 0, 0, 9, 1, 0, 0, 4, 7, 0, 3, 0, 4, 0, 0, 0, 5, 2, 0, 0, 0, 7, 8, 1, 4, 2, 0, 0, 0, 0, 0, 7, 0, 0, 0, 9, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
	// "Hidden 4",
	// [0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 9, 0, 3, 0, 0, 0, 0, 0, 0, 3, 7, 0, 0, 4, 8, 0, 0, 0, 7, 0, 0, 0, 0, 6, 0, 9, 0, 0, 0, 2, 0, 0, 0, 1, 5, 0, 0, 0, 0, 0, 8, 0, 8, 0, 0, 0, 0, 9, 0, 2, 3, 0, 0, 0, 4, 0, 0, 0, 0, 2, 7, 0, 0, 0, 9, 0, 3, 6],
	// "P YWing",
	// [0, 0, 0, 0, 5, 0, 0, 8, 0, 8, 9, 0, 7, 0, 0, 0, 4, 0, 0, 0, 0, 9, 3, 8, 5, 0, 0, 0, 0, 4, 6, 0, 9, 2, 0, 0, 3, 0, 9, 0, 0, 0, 4, 0, 0, 6, 1, 2, 0, 0, 0, 8, 0, 0, 0, 0, 1, 0, 9, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 6, 2],
	// "Pa",
	// [1, 2, 0, 0, 5, 0, 0, 8, 9, 6, 8, 0, 0, 0, 0, 0, 3, 5, 0, 0, 0, 0, 0, 8, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 2, 5, 0, 0, 3, 0, 0, 0, 6, 0, 1, 0, 0, 0, 0, 0, 6, 0, 9, 0, 0, 0, 8, 1, 0, 0, 0, 0, 0, 2, 6, 4, 6, 0, 0, 0, 0, 9, 5, 3],
	// "Pb",
	// [1, 2, 0, 0, 0, 0, 0, 8, 9, 7, 5, 0, 0, 0, 0, 0, 4, 1, 9, 0, 0, 0, 0, 1, 5, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 6, 0, 0, 2, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 9, 0, 0, 8, 0, 0, 6, 4, 6, 8, 0, 0, 4, 0, 0, 7, 5],
	// "Pc",
	// [1, 0, 3, 0, 5, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 2, 7, 3, 4, 0, 0, 0, 0, 9, 0, 0, 4, 8, 0, 0, 7, 0, 4, 0, 0, 8, 9, 3, 0, 0, 0, 2, 0, 1, 0, 5, 6, 0, 0, 0, 0, 8, 4, 1, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 7, 0],
	// "Pd",
	// [0, 0, 0, 0, 0, 6, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 2, 1, 3, 6, 0, 0, 0, 3, 2, 0, 0, 7, 4, 0, 1, 7, 0, 6, 0, 0, 1, 9, 0, 0, 0, 0, 8, 0, 0, 0, 2, 0, 0, 0, 0, 4, 7, 8, 9, 3, 0, 6, 0, 0, 0, 3, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 8, 4, 0],
	// "Pe",
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 5, 0, 2, 0, 0, 9, 3, 8, 2, 1, 0, 0, 0, 9, 8, 0, 0, 5, 2, 4, 3, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 0, 2, 0, 0, 0, 8, 0, 0, 0, 1, 4, 5, 3, 8, 9, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 8, 0, 0, 0, 0, 0, 4, 0, 1, 0],
	// "Pf",
	// [0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 3, 0, 8, 0, 9, 1, 3, 0, 6, 0, 0, 0, 9, 4, 0, 8, 0, 3, 6, 0, 6, 0, 8, 0, 4, 0, 5, 0, 1, 0, 0, 5, 0, 0, 0, 8, 2, 0, 0, 0, 1, 8, 2, 4, 9, 0, 0, 0, 8, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
	// "Phist",
	// [0, 0, 0, 0, 0, 6, 0, 0, 0, 7, 5, 0, 0, 0, 9, 0, 0, 0, 0, 0, 8, 2, 1, 7, 6, 0, 0, 2, 0, 5, 0, 0, 0, 9, 0, 0, 0, 0, 1, 0, 0, 0, 8, 0, 4, 0, 3, 9, 0, 0, 0, 5, 0, 0, 0, 8, 7, 5, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 6, 0, 0, 0, 7, 0],
	// "Phist",
	// [0, 2, 0, 0, 0, 6, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 2, 8, 1, 6, 0, 0, 0, 0, 9, 0, 0, 7, 8, 0, 0, 0, 0, 6, 0, 0, 0, 2, 4, 0, 0, 3, 5, 0, 0, 0, 9, 7, 0, 0, 0, 1, 6, 0, 8, 5, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 1, 0],
	// "Phist N42",
	// [1, 2, 0, 0, 0, 6, 0, 0, 9, 4, 0, 0, 0, 0, 0, 0, 5, 3, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 8, 0, 7, 0, 0, 5, 0, 0, 8, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 8, 1, 0, 0, 0, 0, 0, 7, 2, 2, 3, 9, 0, 1, 0, 0, 4, 8],
	// "Phist Easy",
	// [0, 2, 0, 0, 0, 0, 0, 8, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 2, 9, 1, 0, 0, 0, 0, 6, 2, 0, 0, 0, 9, 1, 0, 0, 4, 5, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 8, 4, 0, 0, 0, 0, 8, 9, 7, 4, 6, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 0, 0, 5, 0],
	// "Phist 3N2",
	// [0, 2, 0, 0, 0, 6, 0, 0, 9, 0, 8, 0, 0, 0, 0, 0, 4, 0, 0, 0, 9, 7, 8, 3, 1, 0, 2, 3, 0, 2, 0, 0, 0, 9, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 1, 7, 0, 8, 0, 0, 0, 0, 1, 5, 3, 7, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 8, 3, 5, 9, 0, 0, 0, 0, 0],
	// "Phist N2",
	// [1, 2, 0, 0, 0, 0, 0, 8, 0, 8, 5, 0, 7, 0, 0, 0, 6, 1, 4, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1, 6, 5, 0, 0, 0, 0, 8, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 0, 0, 0, 7, 0, 1, 8, 6, 7, 0, 0, 8, 5, 0, 2, 4],
	// "Naked Quint",
	// [0, 0, 0, 4, 0, 6, 0, 0, 0, 0, 0, 6, 2, 0, 0, 0, 3, 0, 0, 9, 7, 0, 0, 0, 0, 5, 0, 7, 0, 0, 0, 9, 4, 0, 0, 0, 2, 3, 0, 0, 6, 0, 0, 9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 8, 0, 2, 5, 0, 0, 0, 0, 0, 0, 0, 6, 3, 3, 5, 0, 0, 0, 0, 0, 0, 7],
	// "Phistomefel Easy",
	// [0, 2, 0, 0, 0, 0, 0, 8, 0, 6, 0, 0, 0, 0, 8, 0, 2, 3, 0, 0, 0, 2, 9, 3, 6, 0, 0, 0, 0, 1, 7, 0, 0, 0, 0, 0, 4, 0, 8, 0, 0, 0, 3, 0, 0, 0, 0, 9, 0, 0, 0, 2, 4, 0, 0, 0, 2, 6, 1, 0, 8, 0, 0, 5, 0, 0, 0, 0, 0, 0, 3, 0, 8, 1, 0, 0, 0, 0, 0, 5, 6],
	// "Swordfish x2",
	// [0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0, 4, 9, 2, 0, 0, 0, 0, 6, 9, 0, 0, 0, 0, 5, 0, 0, 9, 0, 0, 0, 0, 0, 6, 0, 8, 0, 0, 7, 1, 4, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 3, 0, 0, 0, 9, 0, 0, 0, 0, 5, 0, 0, 0, 4, 3, 0, 0, 1, 0, 0, 0, 0, 7, 0],
	// "Phistomefel 1",
	// [1, 2, 0, 0, 0, 6, 0, 8, 9, 6, 9, 0, 0, 0, 0, 0, 5, 2, 0, 0, 7, 0, 0, 0, 6, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 7, 0, 0, 0, 9, 0, 0, 0, 4, 0, 0, 0, 0, 7, 3, 0, 0, 0, 0, 0, 0, 2, 0, 0, 8, 0, 0, 0, 8, 1, 0, 5, 0, 0, 0, 7, 3, 7, 5, 0, 0, 0, 0, 0, 9, 8],
	// "Phistomefel 2",
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 9, 7, 2, 1, 4, 0, 6, 6, 0, 5, 0, 4, 0, 2, 0, 7, 0, 9, 4, 0, 0, 0, 8, 0, 0, 8, 0, 7, 0, 0, 5, 1, 0, 0, 0, 0, 2, 1, 6, 4, 9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0],
	// "Phistomefel 3",
	// [1, 2, 0, 0, 0, 0, 0, 8, 9, 5, 7, 0, 0, 9, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1, 8, 0, 0, 4, 0, 0, 0, 0, 8, 0, 0, 7, 0, 0, 0, 0, 0, 0, 5, 0, 9, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 4, 7, 4, 3, 0, 0, 6, 0, 0, 9, 5],
	// "Phistomefel 4",
	// [0, 0, 0, 0, 5, 0, 0, 0, 9, 0, 0, 0, 2, 0, 3, 1, 0, 0, 0, 0, 5, 0, 8, 1, 3, 0, 6, 0, 7, 0, 0, 0, 0, 6, 5, 0, 0, 0, 4, 1, 0, 5, 2, 0, 0, 0, 0, 1, 0, 0, 0, 9, 0, 0, 0, 6, 2, 8, 9, 4, 5, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// "Phistomefel 5",
	// [0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 8, 0, 6, 7, 2, 0, 1, 0, 0, 0, 0, 5, 0, 0, 0, 8, 0, 7, 0, 7, 9, 2, 0, 0, 3, 0, 0, 0, 0, 8, 0, 6, 0, 0, 0, 0, 0, 0, 1, 5, 3, 8, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 5, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0],
	// "Phistomefel 6",
	// [0, 0, 0, 4, 0, 0, 0, 0, 9, 8, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 6, 0, 0, 8, 5, 0, 0, 7, 0, 9, 0, 0, 0, 8, 0, 3, 0, 1, 5, 0, 0, 0, 9, 0, 0, 0, 0, 8, 0, 0, 0, 6, 0, 0, 0, 0, 2, 9, 3, 5, 1, 0, 0, 0, 9, 1, 0, 6, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	// "Phistomefel Easy",
	// [0, 0, 0, 4, 0, 0, 0, 8, 9, 7, 0, 0, 0, 8, 0, 0, 6, 0, 0, 0, 6, 7, 1, 9, 3, 0, 0, 0, 0, 7, 0, 0, 0, 4, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 3, 0, 2, 0, 0, 0, 8, 0, 0, 0, 0, 8, 0, 7, 1, 2, 0, 0, 0, 7, 0, 0, 0, 2, 0, 0, 8, 0, 6, 0, 0, 0, 0, 0, 4, 0],
	// "Phistomefel 8",
	// [0, 2, 0, 0, 0, 0, 0, 0, 9, 0, 0, 8, 0, 0, 0, 5, 0, 0, 0, 0, 9, 1, 8, 3, 4, 2, 0, 3, 0, 6, 0, 4, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 9, 0, 0, 5, 0, 1, 7, 0, 0, 3, 0, 0, 0, 0, 4, 5, 3, 8, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 8, 0, 0, 0, 4, 0, 0, 0],
	// "Phistomefel - 2 Y Wings",
	// [1, 2, 0, 0, 0, 0, 0, 8, 0, 7, 5, 0, 0, 0, 0, 0, 1, 6, 0, 0, 6, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 9, 0, 0, 0, 0, 0, 7, 0, 5, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 6, 9, 1, 0, 1, 9, 0, 0, 0, 0, 4, 5],
	// "Phistomefel Swordfish",
	// [1, 2, 0, 0, 5, 0, 0, 8, 9, 6, 5, 0, 0, 3, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 5, 6, 0, 3, 0, 0, 0, 0, 0, 7, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 8, 3, 0, 0, 1, 0, 0, 5, 2, 2, 1, 0, 0, 0, 0, 0, 0, 7],
	// "Phist",
	// [1, 2, 0, 0, 0, 0, 0, 8, 0, 9, 0, 0, 0, 8, 7, 0, 1, 3, 0, 0, 0, 1, 0, 9, 4, 0, 0, 0, 0, 2, 7, 6, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 3, 9, 7, 0, 0, 0, 1, 0, 0, 8, 5, 0, 0, 2, 7, 0, 0, 0, 0, 0, 9, 1, 8, 0, 0, 0, 0, 0, 0, 4, 7],
	// "Phist",
	// [1, 2, 0, 4, 0, 0, 0, 8, 9, 4, 5, 6, 0, 0, 8, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 7, 0, 0, 0, 0, 6, 0, 1, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8, 0, 0, 0, 0, 9, 0, 1, 4, 2, 4, 1, 0, 0, 0, 0, 3, 8],
	// "Phist Easy",
	// [0, 0, 3, 0, 5, 0, 7, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 7, 8, 3, 9, 1, 0, 4, 0, 0, 1, 0, 4, 0, 3, 0, 2, 0, 7, 4, 0, 0, 0, 5, 1, 0, 0, 0, 8, 0, 0, 7, 4, 0, 0, 0, 0, 5, 2, 9, 4, 8, 0, 0, 4, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// "Phist",
	// [0, 2, 0, 0, 0, 6, 0, 8, 9, 5, 8, 0, 3, 0, 0, 0, 0, 6, 0, 0, 6, 2, 0, 1, 0, 0, 0, 0, 4, 1, 0, 2, 0, 6, 0, 0, 0, 0, 9, 0, 3, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 5, 0, 4, 0, 0, 2, 5, 0, 3, 9, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 4, 1],
	// "Phist",
	// [0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 4, 0, 9, 8, 3, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8, 0, 0, 2, 9, 0, 0, 0, 0, 1, 6, 0, 0, 2, 0, 0, 0, 0, 2, 1, 0, 8, 5, 0, 6, 0, 0, 0, 0, 0, 7, 0, 9, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0],
	// "Phist",
	// [0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 7, 8, 9, 1, 2, 0, 0, 0, 1, 8, 0, 0, 9, 6, 7, 0, 7, 0, 4, 0, 0, 2, 5, 0, 8, 0, 0, 2, 0, 0, 0, 9, 0, 0, 0, 0, 5, 7, 1, 4, 8, 9, 0, 0, 8, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 1, 5, 0],
	// "Phist",
	// [1, 2, 0, 0, 0, 0, 0, 8, 9, 4, 6, 0, 0, 0, 0, 3, 2, 1, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 4, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 5, 9, 0, 0, 0, 7, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 6, 7, 4, 2, 7, 0, 6, 0, 0, 0, 9, 3],
	// "Phist",
	// [0, 0, 0, 0, 0, 6, 0, 8, 0, 0, 4, 0, 0, 7, 0, 0, 0, 2, 0, 0, 7, 3, 9, 2, 1, 0, 0, 5, 0, 2, 8, 0, 0, 4, 0, 7, 0, 0, 9, 0, 4, 0, 3, 0, 0, 0, 0, 4, 0, 0, 3, 6, 0, 0, 4, 0, 1, 6, 8, 9, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 7, 0, 0, 0, 0, 0],
	// "Phist",
	// [0, 0, 0, 0, 0, 0, 7, 0, 9, 0, 0, 0, 0, 0, 8, 0, 3, 0, 0, 0, 8, 3, 1, 7, 5, 0, 0, 0, 0, 4, 1, 0, 5, 9, 0, 0, 6, 0, 9, 0, 0, 0, 3, 5, 0, 0, 0, 7, 0, 0, 0, 2, 0, 0, 0, 0, 5, 7, 8, 9, 1, 0, 0, 0, 9, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 5, 0, 0, 0, 0, 0],
	// "Phist Easy",
	// [1, 2, 0, 0, 5, 0, 0, 8, 9, 6, 8, 0, 9, 0, 0, 0, 3, 5, 0, 0, 9, 0, 8, 0, 2, 4, 0, 0, 6, 0, 0, 0, 5, 0, 0, 0, 0, 0, 8, 0, 0, 9, 0, 0, 0, 0, 0, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 0, 0, 8, 1, 0, 0, 0, 0, 0, 5, 3, 9, 3, 0, 0, 0, 0, 0, 1, 2],
	// "Phist",
	// [0, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 4, 7, 8, 2, 1, 0, 0, 0, 0, 8, 2, 0, 0, 9, 0, 0, 0, 0, 6, 0, 0, 0, 2, 3, 0, 0, 0, 2, 0, 9, 4, 0, 0, 0, 0, 0, 9, 8, 4, 5, 6, 0, 0, 6, 5, 0, 0, 0, 3, 0, 9, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0],
	// "Phist",
	// [1, 2, 0, 0, 0, 0, 0, 8, 9, 4, 5, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 3, 0, 0, 0, 1, 0, 8, 0, 6, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 8, 0, 0, 3, 8, 4, 6, 0, 0, 3, 0, 9, 1, 3, 1, 0, 0, 0, 0, 0, 6, 5],
	// "Phist",
	// [0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 5, 0, 0, 0, 0, 0, 3, 0, 0, 0, 6, 3, 7, 9, 5, 0, 0, 0, 0, 2, 0, 0, 0, 1, 6, 5, 0, 0, 1, 0, 0, 0, 9, 2, 0, 0, 0, 5, 1, 0, 0, 8, 0, 0, 0, 0, 9, 7, 6, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 2, 0, 1],
	// "20",
	// '003006700070000500040018000650100000000000200000000008000000003500002000280900004'.split(''),
	// "20",
	// '023006000080000010000170040060000002910000008000000630000800000000000970000501000'.split(''),
	// "20",
	// '000400700050000010000800300000000000805207000430000600000005000002001007900000402'.split(''),
	// "20",
	// '100006000000000013908000600006000200030070000070003800000140900000930000050000000'.split(''),
	// "20",
	// '000000000000020104600000002002080000004000096000063000000048001090000005750000030'.split(''),
	// "20 X",
	// '100450000000000060090000002006000090002130007000040000000802001089000500000000006'.split(''),
	// "20",
	// '020050009600008000000000000004010000070300920000007008000040000090000370061080000'.split(''),
	// "20",
	// '003000000000700001000100006050000007010590000460003008070000000502000300000010900'.split(''),
	// "20",
	// '020000080007390010060000000002000500589000072000004000000005900801000000000200000'.split(''),
	// "20 X",
	// '000000780400200000065100000800000000000500000000002904040090603001800005000000400'.split(''),
	// "20",
	// '020050080007000640000308000000000000000002008030040010902001070000030000006000900'.split(''),
	// "20",
	// '100000000089001000000000003000042000050000697000000500060000300000090102005704000'.split(''),
	// "Jellyfish2 N2 YWing",
	// '103400700800030056060900000000090000000500090009004002001000500300080000000100478'.split(''),
	// "Jellyfish3 1258",
	// '003000000050080100080902000800500000400620090091040056000000900007000240000078001'.split(''),
	// "Jellyfish4 N2 Deadly YWing",
	// '000000700060020005009000026800500000000700800001630900500004090086300000002007010'.split(''),
	// "Jellyfish5 N2",
	// '000000700000010340804000000302048600090000410000060000908020000007000006041680000'.split(''),
	// "Jellyfish3",
	// '100006700070000000608000540000740000785000000040000102200090005001020003050800000'.split(''),
	// "Jellyfish1",
	// '023000700400000005570003604040002008000000302900075000200508000001600000008000050'.split(''),	
	// "Jellyfish4",
	// '003000080000000005090370000030020600500900040207010050600000892080005006000600000'.split(''),
	// "Jellyfish9",
	// '000400089500700040408000002005002000030140500002030100001000008300080270000000000'.split(''),
	// "Jellyfish5 0367",
	// '103006080006900400000080000072091000030640002040000000009000007200030060008007503'.split(''),
	// "Jellyfish5 1478",
	// '000400709000071240000800000059000010007008000401902000790000300000040020000003170'.split(''),
	// "Jellyfish2",
	// '020000000000130064860090000401700000000000070680010000000085001500640090000000408'.split(''),
	// "Jellyfish3",
	// '000000080009720000000001240800270590000049002007005800000000600381600050700004020'.split(''),
	// "Jellyfish5",
	// '103000000087010400060007000090300000040900008000004200004000030730002906000560007'.split(''),
	// "Jellyfish1",
	// '000050709050000030607000020400300000080072000092008060070000900204007000960500000'.split(''),
	// "Jellyfish8",
	// '020006000500700340800090100001005270050000000004100000402070030000000017090000005'.split(''),
	// "Phist Rand 2YWing Deadly N322 H2",
	// '100056080500000000064109300200000890000000000038001200402000010000070908050000060'.split(''),
	// "N5/9",
	// '003056700400380005000000000040000000809710000000020590500090012000000008601000040'.split(''),
	// "N5/9 XYZ N2",
	// '003000000609030010408007020000875000000000073000002801500000400000504068000001200'.split(''),
	// "H3/9 N64222 rare",
	// '003400709007301040000009050000000000900020000000907430004160003300000007250000600'.split(''),
	// "H2/9 N7 rare",
	// '123050700000000406000000000005670200210005000000800004000000000476300100800760002'.split(''),
	// "H2/9 N7 Deadly N22 rare",
	// '003050000040100200678000000000000057010000803000900100004070308000000900002040060'.split(''),
	// "XY-Chains",
	// '000050080059008600000703200002000000000604570000070006000045000000007140930000800'.split(''),
	// "Simple Colouring",
	// '000000709007200140040007000300090000000003205000700006400008000580064000002500460'.split(''),
	// "c",
	// '000050000497000000068090420001000000000109802000062050800045000005000308900700500'.split(''),
	// "d",
	// '000450709000000034000700000390010856004005003000000000600007000039008060800600901'.split(''),
	// "e",
	// '023400080090008650600090000006000070040900000701200040000002800200309400000610500'.split(''),
	// "f",
	// '000000000089072000050900300010800900000009030607100000000000001502010000000640802'.split(''),
	// "g",
	// '000006009700021060050000010000840000000060008016003000008000040500037000902004007'.split(''),
	// "N532 Deadly",
	// '000406780000000452080020000070000003340000600200000010000009004010542030060130000'.split(''),
	// "N5 YWing XYZWing",
	// '100000089000130400090020300840500070000860000500010000000000803000670200060000540'.split(''),
	// "N52 2yWing",
	// '023400700600008400000007000037004090500709008000000060090000620810000000000005000'.split(''),
	"19 clue 1 simple",
	'003400000700000000000010600060000000000070040050002930000003000000065800914000000'.split(''),
	"19 clue 2 brute",
	'000050700000100000590003600300000007000060400800070000006090000000000008009000031'.split(''),
	"19 clue 3 simple",
	'000000080060200010050007040070065000800001090000000002009004000400000000002000005'.split(''),
	"19 clue 4 simple",
	'020056000008000000090070300480010000000000020000000050300009000700002800000000407'.split(''),
	"30 clue 1",
	'000400080008029030090003004370060048900000600680002375000200007007005890000017000'.split(''),
	"30 clue 2",
	'023400000500300000600000400302000608000010004805030921001200006006100300438960000'.split(''),
	"30 clue 3",
	'000050080000000204748000601090000170800700940600900008500200093280004000007090810'.split(''),
	"30 clue 4",
	'000000780067280140000900300046700000210500000030060004000000407001009050654007901'.split(''),
	"30 clue 5",
	'000400700068903010004080006046109002000000000800000050680210500010035208200004600'.split(''),
	"30 clue 6",
	'023400709000900314090010000201000500000000000060040032600090871009070050002130040'.split(''),
	"30 clue 7",
	'120450080004009035089030060400300507302547900000000003001000000000800090000904050'.split(''),
	"30 clue 8",
	'023006080540080001807001000000020000301070200002010097734000102000000005605000038'.split(''),
	"30 clue 9",
	'000000000589107000070002005000003800800571002030208010950000071000000290010720043'.split(''),
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
		localStorage.removeItem("gridName");
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

const DataVersion = "0.2";

const saveGrid = (selectedIndex = null) => {
	if (selectedIndex !== null) localStorage.setItem("gridName", selectedIndex);
	localStorage.setItem("DataVersion", DataVersion);
	localStorage.setItem("startGrid", board.startCells.toStorage());
	localStorage.setItem("grid", board.cells.toStorage());
};
const loadGrid = () => {
	if (localStorage.getItem("DataVersion") !== DataVersion) return false;

	const selectedIndex = localStorage.getItem("gridName");
	if (selectedIndex !== null) {
		const selectedInt = parseInt(selectedIndex);
		if (selectedInt > 0 && selectedInt < selector.options.length) selector.selectedIndex = selectedInt;
	}

	const startGrid = localStorage.getItem("startGrid");
	if (!startGrid) return false;

	board.startCells.fromStorage(startGrid);

	const grid = localStorage.getItem("grid");
	if (grid) {
		board.cells.fromStorage(grid);
	}
};

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
		if (timer && superpositionMode === 0) superimposeMarkers(true);
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
	if (timer) superimposeMarkers(false);

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
		superimposeMarkers();
	}
};
picker.addEventListener('click', pickerClick);

const pickerMarkerClick = (event) => {
	// event.preventDefault();

	if (!selected) return;

	const running = timer ? true : false;
	if (timer) superimposeMarkers(false);

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
		superimposeMarkers();
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

const markerButton = document.createElement('button');
markerButton.appendChild(document.createTextNode("x"));
markerButton.style.position = 'absolute';
markerButton.style.width = '32px';
markerButton.style.height = '32px';

markerButton.addEventListener('click', () => {
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
document.body.appendChild(markerButton);

const superimposeMarkers = (reset = false) => {
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

			progress = loneSingles(cells);
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
		for (const index of Grid.indices) union[index] = new CellMarker(index);
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
		for (const index of Grid.indices) intersection[index] = new CellMarker(index);
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
			for (const index of Grid.indices) union[index] = new CellMarker(index);
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
		for (const index of Grid.indices) intersection[index] = new CellMarker(index);
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
				for (const index of Grid.indices) union[index] = new CellMarker(index);
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
const superpositionMarkerButton = document.createElement('button');
superpositionMarkerButton.appendChild(document.createTextNode("M"));
superpositionMarkerButton.style.position = 'absolute';
superpositionMarkerButton.style.width = '32px';
superpositionMarkerButton.style.height = '32px';
superpositionMarkerButton.style.top = '0px';
superpositionMarkerButton.style.right = '80px';
superpositionMarkerButton.addEventListener('click', () => {
	superpositionMode = 0;
	superimposeMarkers();
});
document.body.appendChild(superpositionMarkerButton);

const superpositionMarkerAllButton = document.createElement('button');
superpositionMarkerAllButton.appendChild(document.createTextNode("A"));
superpositionMarkerAllButton.style.position = 'absolute';
superpositionMarkerAllButton.style.width = '32px';
superpositionMarkerAllButton.style.height = '32px';
superpositionMarkerAllButton.style.top = '0px';
superpositionMarkerAllButton.style.right = '40px';
superpositionMarkerAllButton.addEventListener('click', () => {
	superpositionMode = 1;
	superimposeMarkers();
});
document.body.appendChild(superpositionMarkerAllButton);

const superpositionSymbolButton = document.createElement('button');
superpositionSymbolButton.appendChild(document.createTextNode("S"));
superpositionSymbolButton.style.position = 'absolute';
superpositionSymbolButton.style.width = '32px';
superpositionSymbolButton.style.height = '32px';
superpositionSymbolButton.style.top = '0px';
superpositionSymbolButton.style.right = '0px';
superpositionSymbolButton.addEventListener('click', () => {
	superpositionMode = 2;
	superimposeMarkers();
});
document.body.appendChild(superpositionSymbolButton);

selector.style.transform = 'translateX(-50%)';
clearButton.style.transform = 'translateX(-50%)';
markerButton.style.transform = 'translateX(-50%)';

markerButton.style.touchAction = "manipulation";

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

		markerButton.style.bottom = '324px';
		markerButton.style.left = '96px';

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

		markerButton.style.bottom = '128px';
		markerButton.style.left = '50%';

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
