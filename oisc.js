function OISC(memory){
    this.step = function() {
        if (program_counter >= 0 && (program_counter + 2) < memory.length){
            var a, b, c;

            a = memory[program_counter];
            b = memory[program_counter + 1];
            //c = memory[program_counter + 2];

            a = a % memory.length;
            b = b % memory.length;
            //c = c % memory.length;

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
                    c = memory[program_counter + 2];
                    c = c % memory.length;
                    program_counter = c;
                }
            }
            console.log("pc:"+program_counter);
        }else{
            console.log("pc:"+program_counter+" stop");
        }
        return memory;
    }

    //init
    var program_counter = 0;
}