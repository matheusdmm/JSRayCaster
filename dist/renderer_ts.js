/*
 *
 *  Typescript Raycaster demo
 *
 *
 *  Matheus da Fonseca Dummer
 */
/* --- Declarations & configs --- */
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var canvas = document.createElement('canvas');
canvas.setAttribute('width', SCREEN_WIDTH);
canvas.setAttribute('height', SCREEN_HEIGHT);
document.body.appendChild(canvas);
// Config for Field Of View
var FOV = 85;
// Config for TICK Rate
var TICK = 30;
// Std cell size
var CELL_SIZE = 64;
// player size
var PLAYER_SIZE = 10;
// collor pallete/textures
var COLORS = {
    rays: '#ffa600'
};
// player obj
var player = {
    x: CELL_SIZE * 1.5,
    y: CELL_SIZE * 2,
    angle: 0,
    speed: 0
};
// MAPS
// Later on you probably will gonna import here the custom maps
var map = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
];
// context canvas
var context = canvas.getContext('2d');
/* --- Functions --- */
function clearScreen() {
    context.fillStyle = "black";
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}
function movePlayer() {
}
/* --- Renderer --- */
function gameLoop() {
    clearScreen();
    movePlayer();
    var rays = getRays();
    renderScene(rays);
    renderMiniMap(0, 0, 0.75, rays);
}
function renderScene(rays) {
}
function renderMiniMap(posX, posY, scale, rays) {
    if (posX === void 0) { posX = 0; }
    if (posY === void 0) { posY = 0; }
    if (scale === void 0) { scale = 1; }
}
setInterval(gameLoop, TICK);
/* --- Event Listeners --- */
document.addEventListener("keydown", function (event) {
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
document.addEventListener("keyup", function (event) {
    if (event.key === "w" || event.key === "s" || event.key === "a" || event.key === "d") {
        player.speed = 0;
    }
});
document.addEventListener("mousemove", function (event) {
    player.angle += toRadians(event.movementX);
});
//# sourceMappingURL=renderer_ts.js.map