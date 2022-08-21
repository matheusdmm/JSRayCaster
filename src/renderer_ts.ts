/*
 *
 *  Typescript Raycaster demo
 * 
 * 
 *  Matheus da Fonseca Dummer
 */

/* --- Declarations & configs --- */
const SCREEN_WIDTH: any = window.innerWidth;
const SCREEN_HEIGHT: any = window.innerHeight;

const canvas = document.createElement('canvas');
canvas.setAttribute('width', SCREEN_WIDTH);
canvas.setAttribute('height', SCREEN_HEIGHT);
document.body.appendChild(canvas);

// Config for Field Of View
const FOV: number = 85;

// Config for TICK Rate
const TICK: number = 30;

// Std cell size
const CELL_SIZE: number = 64;

// player size
const PLAYER_SIZE: number = 10;

// collor pallete/textures
const COLORS: any = {
    rays: '#ffa600'
}

// player obj
const player: any = {
    x: CELL_SIZE * 1.5,
    y: CELL_SIZE * 2,
    angle: 0,
    speed: 0
};

// MAPS
// Later on you probably will gonna import here the custom maps
const map = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
];

// context canvas
const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

/* --- Functions --- */
function clearScreen(): void {
    context.fillStyle = "black";
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function movePlayer() {

}


/* --- Renderer --- */
function gameLoop(): void {
    clearScreen();
    movePlayer();

    const rays: any = getRays();
    renderScene(rays);
    renderMiniMap(0, 0, 0.75, rays);
}

function renderScene(rays: any) {

}

function renderMiniMap(posX = 0, posY = 0, scale = 1, rays) {

}

setInterval(gameLoop, TICK);

/* --- Event Listeners --- */
document.addEventListener("keydown", (event) => {
    // up & down
    if (event.key === "w") {
        player.speed = 2;
    }
    if (event.key === "s") {
        player.speed = -2;
    }

    // left & right
    if (event.key === "a") {
        player.x += Math.cos(player.angle + toRadians(90)) * player.speed;
        player.y += Math.sin(player.angle + toRadians(90)) * player.speed;
    }

    if (event.key === "d") {
        player.x += Math.cos(player.angle) * player.speed;
        player.y += Math.sin(player.angle) * player.speed;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w" || event.key === "s" || event.key === "a" || event.key === "d") {
        player.speed = 0;
    }
});

document.addEventListener("mousemove", (event) => {
    player.angle += toRadians(event.movementX);
});