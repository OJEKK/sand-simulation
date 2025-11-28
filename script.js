function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
		for (let j = 0; j < arr[i].length; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
}

let grid;
let w = 8;
let cols, rows;

const colors = [
	{ c: [252, 200, 117], weight: 0.85 },
	{ c: [233, 180, 115], weight: 0.1 },
	{ c: [253, 224, 154], weight: 0.05 },
];
function pickColorIndex() {
	let r = random();
	let sum = 0;
	for (let i = 0; i < colors.length; i++) {
		sum += colors[i].weight;
		if (r < sum) return i + 1;
	}
	return colors.length;
}

let dropping = false;

function setup() {
	createCanvas(800, 600);
	cols = width / w;
	rows = height / w;
	grid = make2DArray(cols, rows);
}

function mouseDragged() {
	if (dropping) return;
	let mouseCol = floor(mouseX / w);
	let mouseRow = floor(mouseY / w);

	let matrix = 3;
	let extent = floor(matrix / 2);
	for (let i = -extent; i <= extent; i++) {
		for (let j = -extent; j <= extent; j++) {
			if (random(1) < 0.25) {
				let col = mouseCol + i;
				let row = mouseRow + j;
				if (
					col >= 0 &&
					col < cols &&
					row >= 0 &&
					row < rows &&
					grid[col][row] === 0
				)
					grid[col][row] = pickColorIndex();
			}
		}
	}
}

function draw() {
	background(216, 230, 238);

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let state = grid[i][j];
			if (state > 0) {
				const [r, g, b] = colors[state - 1].c;
				noStroke();
				fill(r, g, b);
				square(i * w, j * w, w);
			}
		}
	}

	let nextGrid = make2DArray(cols, rows);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let state = grid[i][j];
			if (state === 0) continue;
			if (dropping && j === rows - 1) continue;

			if (j < rows - 1 && grid[i][j + 1] === 0)
				nextGrid[i][j + 1] = state;
			else {
				let moved = false;
				let dir = 1;
				if (random(1) < 0.5) dir *= -1;

				if (
					i + dir >= 0 &&
					i + dir < cols &&
					j + 1 < rows &&
					grid[i + dir][j + 1] === 0
				) {
					nextGrid[i + dir][j + 1] = state;
					moved = true;
				} else if (
					i - dir >= 0 &&
					i - dir < cols &&
					j + 1 < rows &&
					grid[i - dir][j + 1] === 0
				) {
					nextGrid[i - dir][j + 1] = state;
					moved = true;
				}
				if (!moved) nextGrid[i][j] = state;
			}
		}
	}
	grid = nextGrid;

	if (dropping) {
		let any = false;
		for (let i = 0; i < cols && !any; i++) {
			for (let j = 0; j < rows; j++) {
				if (grid[i][j] > 0) {
					any = true;
					break;
				}
			}
		}
		if (!any) dropping = false;
	}
}

function dropSand() {
	dropping = true;
}
