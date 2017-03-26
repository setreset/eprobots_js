var serializationFns = {
    toJson: function() {
        return {
            id: this.getId(),
            age: this.getAge(),
            energy: this.getEnergy(),
            x_pos: this.x_pos,
            y_pos: this.y_pos,
            init_programm: this.getInitialProgram(),
            working_programm: this.getWorkingProgram()
        };
    },
    loadState: function(e_state) {
        this.setAge(e_state.age);
        this.setEnergy(e_state.energy);
        this.setWorkingProgramm(e_state.working_programm);
    }
};

//Object.assign(Herbivore.prototype, serializationFns);
//Object.assign(Carnivore.prototype, serializationFns);

var inputoutpuFns = {
    set_input: function() {
        var inputval = this.s.getWorld().get_environment_val(this.x_pos,this.y_pos);
        //console.log(inputval);
        var program_length = this.s.getSettings().PROGRAM_LENGTH;

        var working_programm = this.getWorkingProgram();
        working_programm[program_length-4] = inputval.local_foodcount;

        working_programm[program_length-5] = inputval.local_eprobotcount_0;
        working_programm[program_length-6] = inputval.local_tracecount_0;

        working_programm[program_length-7] = inputval.local_eprobotcount_1;
        working_programm[program_length-8] = inputval.local_tracecount_1;

        working_programm[program_length-9] = inputval.local_fossilcount;

        working_programm[program_length-10] = inputval.local_fruitfulness;

        working_programm[program_length-11] = this.getAge();
        working_programm[program_length-12] = this.getEnergy();
        working_programm[program_length-13] = this.x_pos;
        working_programm[program_length-14] = this.y_pos;
    },
    get_control_vals: function() {
        var working_programm = this.getWorkingProgram();
        var stepcounter = tools_compute(working_programm);
        if (stepcounter>20){
            //var penalty = parseInt((stepcounter-20)/10);
            var penalty = stepcounter;
            this.addEnergy(-penalty);
        }

        return [
            working_programm[this.s.getSettings().PROGRAM_LENGTH-1],
            working_programm[this.s.getSettings().PROGRAM_LENGTH-2],
            working_programm[this.s.getSettings().PROGRAM_LENGTH-3]
        ];
    }
};

//Object.assign(Herbivore.prototype, inputoutpuFns);
//Object.assign(Carnivore.prototype, inputoutpuFns);

// https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/