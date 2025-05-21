const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

const cellSize = 4;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);

let grid = Array.from({ length: rows }, () => Array(cols).fill(null));
let factions = {};
let running = true;

const behaviors = ["aggressive", "defensive", "random", "chaotic"];
const archetypes = {
    Swarm: { aggression: 1.0, defense: 0.5, expansionism: 2.0, risk: 1.5 },
    Empire: { aggression: 0.8, defense: 2.0, expansionism: 0.7, risk: 0.6 },
    Rogue: { aggression: 1.8, defense: 0.5, expansionism: 1.2, risk: 2.0 },
    Cult: { aggression: 0.9, defense: 1.2, expansionism: 1.0, risk: 1.5 },
};

function randomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
}

function createFactions(count = 200) {
    factions = {};
    for (let i = 0; i < count; i++) {
        let color = randomColor();
        while (factions[color]) color = randomColor();
        const arch = Object.keys(archetypes)[Math.floor(Math.random() * 4)];
        factions[color] = {
            name: `Faction ${i + 1}`,
            behavior: behaviors[Math.floor(Math.random() * behaviors.length)],
            personality: { ...archetypes[arch] }
        };

        // Seed initial cells
        for (let j = 0; j < 30; j++) {
            const x = Math.floor(Math.random() * cols);
            const y = Math.floor(Math.random() * rows);
            if (!grid[y][x]) grid[y][x] = color;
        }
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function stepSimulation() {
    const newGrid = grid.map(row => [...row]);
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const color = grid[y][x];
            if (!color) continue;

            const faction = factions[color];
            if (!faction) continue;

            const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) {
                const target = grid[ny][nx];
                if (!target || (target !== color && Math.random() < 0.3 * faction.personality.aggression)) {
                    newGrid[ny][nx] = color;
                }
            }
        }
    }

    grid = newGrid;
    drawGrid();
}

function gameLoop() {
    if (running) stepSimulation();
    requestAnimationFrame(gameLoop);
}

document.getElementById("newGame").onclick = () => {
    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    createFactions();
    drawGrid();
};

document.getElementById("pause").onclick = () => {
    running = !running;
};

createFactions();
drawGrid();
requestAnimationFrame(gameLoop);
