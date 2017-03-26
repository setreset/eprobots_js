class Eprobot {

    constructor(s, x_pos, y_pos, init_programm) {
        // init
        var t = s.getWorld().getTerrain(x_pos, y_pos);
        t.setSlotObject(this);

        this.age = 0;

        this.s = s;
        this.x_pos = x_pos;
        this.y_pos = y_pos;

        this.init_programm = init_programm;
        this.working_programm = init_programm.slice(0);
    }

    toJSON() {
        return {
            id: this.getId(),
            age: this.age,
            energy: this.energy,
            x_pos: this.x_pos,
            y_pos: this.y_pos,
            init_programm: this.init_programm,
            working_programm: this.working_programm
        };
    }

    loadState(e_state) {
        this.age = e_state.age;
        this.energy = e_state.energy;
        this.working_programm = e_state.working_programm;
    }

    set_input() {
        var inputval = this.s.getWorld().get_environment_val(this.x_pos,this.y_pos);
        //console.log(inputval);
        var program_length = this.s.getSettings().PROGRAM_LENGTH;

        var working_programm = this.working_programm;
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
    }

    get_control_vals() {
        var working_programm = this.working_programm;
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

    // GETTER / SETTER

    getAge(){
        return this.age;
    }

    setAge(new_age){
        this.age = new_age;
    }

    incrAge(){
        this.age++;
    }

    addEnergy(number) {
        this.energy += number;
        if (this.energy < 0){
            this.energy = 0;
        }
    };

    getEnergy(){
        return this.energy;
    }

    setEnergy(new_energy){
        this.energy = new_energy;
    }

    getPos(){
        return {"x": this.x_pos, "y": this.y_pos}
    }

    setPos(new_x_pos, new_y_pos){
        this.x_pos = new_x_pos;
        this.y_pos = new_y_pos;
    }
}