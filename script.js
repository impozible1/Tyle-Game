const toColor = {
    'empty': 'white',
    'grass': 'green',
    'water': 'dodgerblue',
    'dirt': 'sienna',
    'virus': 'purple',
    'pig': 'hotpink',
    'hippo': 'grey',
    'hippoHead': 'grey'
}

var tiles = [];

class Tile {
    constructor (type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }
    add () {
        var div = document.createElement('div');
        div.style.left = this.x*10+'px';
        div.style.top = this.y*10+'px';
        div.style.width = '10px';
        div.style.height = '10px';
        div.style.backgroundColor = toColor[this.type];
        div.className = 'tile';
        document.body.appendChild(div);
    }
}

function makeHippo (x, y) {
    changeTileTo('hippoHead', x, y);
    changeTileTo('hippo', x, y+1);
    changeTileTo('hippo', x+1, y+1);
    changeTileTo('hippo', x+1, y);
}

function moveHippo (fromX, fromY, toX, toY) {
    changeTileTo('grass', fromX, fromY);
    changeTileTo('grass', fromX+1, fromY);
    changeTileTo('grass', fromX, fromY+1);
    changeTileTo('grass', fromX+1, fromY+1);
    makeHippo(toX, toY);
}

function randInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clear() {
    document.querySelectorAll('.tile').forEach(element => {
        element.remove();
    });
}

function init () {
    for (var y = 0; y < 70; y++) {
        for (var x = 0; x < 70; x++) {
            tiles.push(new Tile ('grass', x, y));
        }
    }
}

function changeTileTo (to, x, y) {
    tiles.forEach(tile => {
        if (tile.x === x && tile.y === y) {
            tile.type = to;
            return;
        }
    });
} 

function getTileType (x, y) {
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].x === x && tiles[i].y === y) {
            return tiles[i].type;
        } 
    }
}

function generateLake () {
    var randX = randInt(0, 70);
    var randY = randInt(1, 70);
    for (var i = 0; i < randInt(100, 300); i++) {
        changeTileTo('water', randX, randY);
        randX+=randInt(-1, 1);
        randY+=randInt(-1, 1);
    }
}

function touching (tile, x, y) {
    // I'm sorry.
    if (getTileType(x+1, y) === tile) {
        return true;
    } else if (getTileType(x+1, y+1) === tile) {
        return true;
    } else if (getTileType(x, y+1) === tile) {
        return true;
    } else if (getTileType(x-1, y) === tile) {
        return true;
    } else if (getTileType(x-1, y-1) === tile) {
        return true;
    } else if (getTileType(x, y-1) === tile) {
        return true;
    } else if (getTileType(x+1, y-1) === tile) {
        return true;
    } else if (getTileType(x-1, y+1) === tile) {
        return true;
    }
    return false;
}

function render () {
    clear();
    tiles.forEach(tile => {
        tile.add();
    });
}

function update () {
    tiles.forEach(tile => {
        var directionX1 = randInt(-1, 1);
        var directionY1 = randInt(-1, 1);
        var directionX2 = randInt(-1, 1);
        var directionY2 = randInt(-1, 1);
        if (tile.type === 'dirt') {
            if (randInt(1, 5) === 1) {
                changeTileTo('grass', tile.x, tile.y);
            }
            if (touching('water', tile.x, tile.y)) {
                changeTileTo('grass', tile.x, tile.y);
            }
        }
        if (tile.type === 'virus') {
            changeTileTo('virus', tile.x+directionX1+randInt(-2, 2), tile.y+directionY1+randInt(-2, 2));
        }
        if (tile.type === 'pig') {
            if (randInt(1, 10) === 1) {
                if (directionX2 !== 0 && directionY2 !== 0) {
                    if(!touching('water', tile.x, tile.y)) {
                        changeTileTo('pig', tile.x+directionX2, tile.y+directionY2);
                    }
                    changeTileTo('grass', tile.x, tile.y);
                }
            }
        }
        if (tile.type === 'hippoHead') {
            if (randInt(1, 1) === 1) {
                if (directionX1 !== 0 && directionY2 !== 0) {
                    moveHippo(tile.x, tile.y, tile.x+directionX1, tile.y+directionY2);
                }
            }
        }
    });
}

init();
for (var i = 0; i < randInt(1, 5); i++) {
    makeHippo(randInt(0, 75), randInt(0, 75));
}
for (var i = 0; i < randInt(2, 10); i++) {
    generateLake();
}
for (var i = 0; i < randInt(2, 10); i++) {
    changeTileTo('pig', randInt(0, 75), randInt(0, 75));
}
render();
setInterval (() => {
    update();
    render();
}, 0);