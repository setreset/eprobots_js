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
    FOSSIL: 3
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

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}


function merge_colors(rgb0, rgb1){
    var r_new = tools_map_range(rgb0[0], 0, 255, 0, 1.0) * tools_map_range(rgb1[0], 0, 255, 0, 1.0);
    var g_new = tools_map_range(rgb0[1], 0, 255, 0, 1.0) * tools_map_range(rgb1[1], 0, 255, 0, 1.0);
    var b_new = tools_map_range(rgb0[2], 0, 255, 0, 1.0) * tools_map_range(rgb1[2], 0, 255, 0, 1.0);

    r_new = tools_map_range(r_new, 0, 1.0, 0, 255);
    g_new = tools_map_range(g_new, 0, 1.0, 0, 255);
    b_new = tools_map_range(b_new, 0, 1.0, 0, 255);

    return [Math.round(r_new), Math.round(g_new), Math.round(b_new)];
}