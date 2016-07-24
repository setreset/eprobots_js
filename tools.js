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

var OBJECTTYPES = {
    ENERGY: 1,
    EPROBOT: 2,
    FOSSIL: 3,
    WATER: 4
}

// liefert ganzzahlen von 0 bis max-1
function tools_random(max){
    return Math.floor(Math.random()*max);
}

function tools_compute(memory) {
    var program_counter = 0;
    var step_counter = 0;
    var a, b, c;

    //console.log("compute");
    while (program_counter >= 0 && (program_counter + 2) < memory.length && step_counter < 100) {
        //console.log(program_counter);
        a = memory[program_counter];
        b = memory[program_counter + 1];
        c = memory[program_counter + 2];

        a = a % memory.length;
        b = b % memory.length;
        c = c % memory.length;

        //a = Math.abs(a % memory.length);
        //b = Math.abs(b % memory.length);
        //c = Math.abs(c % memory.length);

        if (a < 0 || b < 0) {
            program_counter = -1;
        } else {
            memory[b] = memory[b] - memory[a];
            if (memory[b] > 0) {
                program_counter = program_counter + 3;
            } else {
                program_counter = c;
            }
        }
        step_counter++;
    }
}

function tools_mutate(memory) {
    var new_memory = [];
    for (var i=0;i<memory.length;i++){
        var copyval = memory[i];
        if (Math.random()<0.01){
            copyval = copyval + (tools_random(400)-200);
        }
        new_memory.push(copyval);
    }
    return new_memory;
}

function tools_recombine(memory1, memory2) {
    var crossover_at = tools_random(GLOBAL_SETTINGS.PROGRAM_LENGTH);

    var new_memory = [];
    for (var i=0;i<GLOBAL_SETTINGS.PROGRAM_LENGTH;i++){
        if (i < crossover_at){
            var copyval = memory1[i];
        }else{
            var copyval = memory2[i];
        }

        // mit eingebauter mutation
        if (Math.random()<0.01){
            copyval = copyval + (tools_random(400)-200);
        }

        new_memory.push(copyval);
    }
    return new_memory;
}

function tools_map_range(value, low1, high1, low2, high2){
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
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