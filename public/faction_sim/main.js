
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const CELL_SIZE = 4;
const COLS = Math.floor(WIDTH / CELL_SIZE);
const ROWS = Math.floor(HEIGHT / CELL_SIZE);

let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let claimAge = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let cooldown = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

let factions = {};
let running = true;

function randomColor() {
    return `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`;
}

function createFaction(name) {
    const color = randomColor();
    if (factions[color]) return createFaction(name);

    factions[color] = {
        name,
        color,
        aggression: Math.random() * 1.5 + 0.5,
        defense: Math.random() * 1.5 + 0.5,
        expansionism: Math.random() * 1.5 + 0.5,
        risk: Math.random() * 1.5 + 0.5,
    };

    // Spawn initial tiles
    let count = 0;
    while (count < 30) {
        let x = Math.floor(Math.random() * COLS);
        let y = Math.floor(Math.random() * ROWS);
        if (!grid[y][x]) {
            grid[y][x] = color;
            count++;
        }
    }

    return color;
}

function drawGrid() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const color = grid[y][x];
            ctx.fillStyle = color || 'black';
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

function calculateFactionPower() {
    const power = {};
    for (let row of grid) {
        for (let cell of row) {
            if (cell) power[cell] = (power[cell] || 0) + 1;
        }
    }
    return power;
}

function stepSimulation() {
    let newGrid = grid.map(row => row.slice());
    let newClaimAge = claimAge.map(row => row.slice());
    let newCooldown = cooldown.map(row => row.slice());
    let powerMap = calculateFactionPower();

    let coords = [];
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) coords.push([x, y]);
    coords.sort(() => Math.random() - 0.5);

    const totalCells = ROWS * COLS;
    let dominantColor = null;
    let dominantRatio = 0;
    for (let color in powerMap) {
        const ratio = powerMap[color] / totalCells;
        if (ratio > dominantRatio) {
            dominantRatio = ratio;
            dominantColor = color;
        }
    }

    for (let [x, y] of coords) {
        let color = grid[y][x];
        if (!color || !factions[color]) continue;

        let faction = factions[color];
        let power = powerMap[color] / totalCells;

        if (color === dominantColor && dominantRatio > 0.65) power *= 0.8;
        if (color !== dominantColor && dominantRatio > 0.65) power *= 1.2;

        let spreadChance = 0.05 + Math.random() * 0.1 * faction.risk + power * 0.3 * faction.expansionism;
        let attackChance = 0.03 + Math.random() * 0.1 * faction.risk + power * 0.4 * faction.aggression;

        const dirs = [[0, 1], [1, 0], [-1, 0], [0, -1]];
        for (let [dx, dy] of dirs.sort(() => Math.random() - 0.5)) {
            let nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;

            let target = grid[ny][nx];

            if (!target && Math.random() < spreadChance) {
                newGrid[ny][nx] = color;
                newClaimAge[ny][nx] = 0;
            }

            if (target && target !== color && cooldown[ny][nx] === 0 && claimAge[ny][nx] > 6) {
                if (power > (powerMap[target] || 0) / totalCells || Math.random() < attackChance) {
                    newGrid[ny][nx] = color;
                    newCooldown[ny][nx] = 4;
                }
            }
        }
    }

    // Claim age and cooldown update
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (newGrid[y][x] === grid[y][x]) newClaimAge[y][x]++;
            else newClaimAge[y][x] = 0;

            if (cooldown[y][x] > 0) newCooldown[y][x]--;
        }
    }

    // Decay if dominant
    if (dominantRatio >= 0.6) {
        let decayCount = Math.floor(dominantRatio * 100);
        for (let i = 0; i < decayCount; i++) {
            let x = Math.floor(Math.random() * COLS);
            let y = Math.floor(Math.random() * ROWS);
            if (newGrid[y][x] === dominantColor) {
                newGrid[y][x] = null;
                newClaimAge[y][x] = 0;
            }
        }
    }

    // Victory condition
    if (dominantRatio >= 0.95) {
        running = false;
        alert(`${factions[dominantColor].name} has taken over the world!`);
    }

    grid = newGrid;
    claimAge = newClaimAge;
    cooldown = newCooldown;
    drawGrid();
}

function initGame() {
    factions = {};
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    claimAge = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    cooldown = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    for (let i = 0; i < 30; i++) {
        createFaction(`Faction ${i + 1}`);
    }

    drawGrid();
    if (running) requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!running) return;
    stepSimulation();
    requestAnimationFrame(gameLoop);
}

initGame();