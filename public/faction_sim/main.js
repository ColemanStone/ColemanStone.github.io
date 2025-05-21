const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const cellSize = 4;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);
let grid = Array.from({ length: rows }, () => Array(cols).fill(null));
let factions = {};
let running = false;

function randomColor() {
    return "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
}

function newGame() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    factions = {};
    for (let i = 0; i < 100; i++) {
        let color = randomColor();
        factions[color] = { color, name: `Faction ${i + 1}` };
        for (let j = 0; j < 10; j++) {
            let x = Math.floor(Math.random() * cols);
            let y = Math.floor(Math.random() * rows);
            grid[y][x] = color;
        }
    }
    running = true;
    requestAnimationFrame(simulate);
}

function simulate() {
    if (!running) return;
    const newGrid = grid.map(r => [...r]);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let color = grid[y][x];
            if (!color) continue;
            let dx = Math.floor(Math.random() * 3) - 1;
            let dy = Math.floor(Math.random() * 3) - 1;
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !grid[ny][nx]) {
                newGrid[ny][nx] = color;
            }
        }
    }
    grid = newGrid;
    draw();
    requestAnimationFrame(simulate);
}

function draw() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const color = grid[y][x];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

window.onload = newGame;
