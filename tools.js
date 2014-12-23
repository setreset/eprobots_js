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

var LIFEFORMS = {
    ENERGY: 1,
    EPROBOT: 2
}

// liefert ganzzahlen von 0 bis max-1
function tools_random(max){
    return Math.floor(Math.random()*max);
}

function borderjump_x(x, world_width){
    if (x >= world_width){
        return 0;
    }
    if (x < 0){
        return world_width - 1;
    }
    return x;
}

function borderjump_y(y, world_height){
    if (y >= world_height){
        return 0;
    }
    if (y < 0){
        return world_height-1;
    }
    return y;
}