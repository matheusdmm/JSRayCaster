// https://www.youtube.com/watch?v=5nSFArCgCXA
// 20:19

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

// dom canvas
const canvas = document.createElement("canvas");
canvas.setAttribute("width", SCREEN_WIDTH);
canvas.setAttribute("height", SCREEN_HEIGHT);
document.body.appendChild(canvas);

// Field of view
const FOV = toRadians(85);

// TICK
const tick = 30;

//cell size
const CELL_SIZE = 64;

// player size
const PLAYER_SIZE = 10;

const wallText = './textures/wall.png';

// colors
const COLORS = {
    rays: '#b9b7bd',
    floor: '#122620',
    ceiling: '#145da0',
    wall: '#f4ebd0',
    wallDark:'#b68d40'
};

// player
const player = {
    x: CELL_SIZE * 1.5,
    y: CELL_SIZE * 2,
    angle: 0,
    speed: 0,
};

// map
const map = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
];

// Helper functions

// rad
function toRadians(deg) {
    return (deg * Math.PI) / 180;
}

// fisheye
function fisheyeFix(distance, angle, playerAngle) {
    const difference = angle - playerAngle;
    return distance * Math.cos(difference);
}

// out of bounds
function outOfMapBounds(x, y) {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
}

// distance
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// context canvas
const context = canvas.getContext("2d");

function clearScreen() {
    context.fillStyle = "black";
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function movePlayer() {
    player.x += Math.cos(player.angle) * player.speed;
    player.y += Math.sin(player.angle) * player.speed;
}

function getVcollision(angle) {
    const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);

    const firstX = right
        ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE
        : Math.floor(player.x / CELL_SIZE) * CELL_SIZE;

    const firstY = player.y + (firstX - player.x) * Math.tan(angle);

    const xA = right ? CELL_SIZE : -CELL_SIZE;
    const yA = xA * Math.tan(angle);

    let wall;
    let nextX = firstX;
    let nextY = firstY;
    while (!wall) {
        const cellX = right
            ? Math.floor(nextX / CELL_SIZE)
            : Math.floor(nextX / CELL_SIZE) - 1;
        const cellY = Math.floor(nextY / CELL_SIZE);

        if (outOfMapBounds(cellX, cellY)) {
            break;
        }
        wall = map[cellY][cellX];
        if (!wall) {
            nextX += xA;
            nextY += yA;
        } else {
        }
    }
    return {
        angle,
        distance: distance(player.x, player.y, nextX, nextY),
        vertical: true,
    };
}

function getHcollision(angle) {
    const up = Math.abs(Math.floor(angle / Math.PI) % 2);
    const firstY = up
        ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE
        : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
    const firstX = player.x + (firstY - player.y) / Math.tan(angle);

    const yA = up ? -CELL_SIZE : CELL_SIZE;
    const xA = yA / Math.tan(angle);

    let wall;
    let nextX = firstX;
    let nextY = firstY;
    while (!wall) {
        const cellX = Math.floor(nextX / CELL_SIZE);
        const cellY = up
            ? Math.floor(nextY / CELL_SIZE) - 1
            : Math.floor(nextY / CELL_SIZE);

        if (outOfMapBounds(cellX, cellY)) {
            break;
        }

        wall = map[cellY][cellX];
        if (!wall) {
            nextX += xA;
            nextY += yA;
        }
    }
    return {
        angle,
        distance: distance(player.x, player.y, nextX, nextY),
        vertical: false,
    };
}

function castRay(angle) {
    const verticalCollision = getVcollision(angle);
    const horizontalCollision = getHcollision(angle);

    return horizontalCollision.distance >= verticalCollision.distance
        ? verticalCollision
        : horizontalCollision;
}

function getRays() {
    const initialAngle = player.angle - FOV / 2;
    const numberOfRays = SCREEN_WIDTH;
    const angleStep = FOV / numberOfRays;

    return Array.from({ length: numberOfRays }, (_, i) => {
        const angle = initialAngle + i * angleStep;
        const ray = castRay(angle);
        return ray;
    });
}

function renderScene(rays) {
    const SIZE_WALL = 1;
    const SCREEN_SIZE_FOV = 277;

    //const pat = context.createPattern(COLORS.wall, 'repeat')

    rays.forEach((ray, index) => {
        const distance = fisheyeFix(ray.distance, ray.angle, player.angle);
        const wallHeight =
            ((CELL_SIZE * SIZE_WALL) / distance) * SCREEN_SIZE_FOV;
        context.fillStyle = ray.vertical ? COLORS.wallDark : COLORS.wall;
        context.fillRect(
            index,
            SCREEN_HEIGHT / 2 - wallHeight / 2,
            1,
            wallHeight
        );
        context.fillStyle = COLORS.floor;
        context.fillRect(
            index,
            SCREEN_HEIGHT / 2 + wallHeight / 2,
            1,
            SCREEN_HEIGHT / 2 - wallHeight / 2
        );
        context.fillStyle = COLORS.ceiling;
        context.fillRect(index, 0, 1, SCREEN_HEIGHT / 2 - wallHeight / 2);
    });
}

function renderMiniMap(posX = 0, posY = 0, scale = 1, rays) {
    const cellSize = scale * CELL_SIZE;

    // map rendering
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                context.fillStyle = "grey";
                context.fillRect(
                    posX + x * cellSize,
                    posY + y * cellSize,
                    cellSize,
                    cellSize
                );
            }
        });
    });

    context.strokeStyle = COLORS.rays;
    rays.forEach((ray) => {
        context.beginPath();
        context.moveTo(player.x * scale + posX, player.y * scale + posY);
        context.lineTo(
            (player.x + Math.cos(ray.angle) * ray.distance) * scale,
            (player.y + Math.sin(ray.angle) * ray.distance) * scale
        );
        context.closePath();
        context.stroke();
    });

    // player in minimap
    context.fillStyle = "blue";
    context.fillRect(
        posX + player.x * scale - PLAYER_SIZE / 2,
        posY + player.y * scale - PLAYER_SIZE / 2,
        PLAYER_SIZE,
        PLAYER_SIZE
    );

    // player view in minimap
    const rayLength = PLAYER_SIZE * 2;
    context.strokeStyle = "blue";
    context.beginPath();
    context.moveTo(player.x * scale + posX, player.y * scale + posY);
    context.lineTo(
        (player.x + Math.cos(player.angle) * rayLength) * scale,
        (player.y + Math.sin(player.angle) * rayLength) * scale
    );
    context.closePath();
    context.stroke();
}

function gameLoop() {
    clearScreen();
    movePlayer();

    const rays = getRays();
    renderScene(rays);
    renderMiniMap(0, 0, 0.75, rays);
}

setInterval(gameLoop, tick);



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
