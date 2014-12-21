var DIRECTIONS = [
    {x:-1,y:0},  // left
    {x:-1,y:-1}, // top left
    {x:0,y:-1},  // top
    {x:1,y:-1},  // top right
    {x:1,y:0},   // right
    {x:1,y:1},   // bottom right
    {x:0,y:1},   // bottom
    {x:-1,y:1}   // bottom left
];

// liefert ganzzahlen von 0 bis max-1
function tools_random(max){
    return Math.floor(Math.random()*max);
}

function borderjump_x(x){
    if (x >= SETTINGS.WORLD_WIDTH){
        return 0;
    }
    if (x < 0){
        return SETTINGS.WORLD_WIDTH - 1;
    }
    return x;
}

function borderjump_y(y){
    if (y >= SETTINGS.WORLD_HEIGHT){
        return 0;
    }
    if (y < 0){
        return SETTINGS.WORLD_HEIGHT-1;
    }
    return y;
}