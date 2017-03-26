function Carnivore(s, x_pos, y_pos, init_programm){

    this.newStep = function(){
        var forked_ep = null;

        // set input
        if (s.getSettings().SENSE){
            this.set_input();
        }

        var control_vals = this.get_control_vals();
        var control_val = control_vals[0];

        //var control_val = this.get_move_random();
        if (isFinite(control_val)){
            var move_action = Math.abs(control_val) % 9;
        }else{
            console.log("Infinite: "+control_val);
            var move_action = tools_random(9); // random
        }

        var ocstacle_val = control_vals[2];
        if (isFinite(ocstacle_val)){
            var obstacle_action = Math.abs(ocstacle_val) % 2;
        }else{
            console.log("Infinite: "+ocstacle_val);
            var obstacle_action = 0; // do nothing
        }

        forked_ep = this.processAction(move_action, obstacle_action);

        return forked_ep;
    }

    this.processAction = function(move_action, obstacle_action){
        var forked_ep = null;

        if (move_action > 0){
            var coord__new = s.getWorld().getCoordinates(this, move_action-1);
            if (coord__new){
                var t_new = s.getWorld().getTerrain(coord__new[0],coord__new[1]);

                // ist da auch nichts?
                if (this.canMoveToField(t_new)){
                    this.preMove(t_new);

                    // position verschieben
                    // alte position loeschen
                    var t_old = s.getWorld().getTerrain(this.x_pos, this.y_pos);
                    t_old.setSlotObject(null);
                    t_new.setSlotObject(this);
                    t_new.set_trace(this.getId(), s.getSettings().TRACETIME);
                    this.setPos(coord__new[0],coord__new[1]);
                }
            }
        }

        if (obstacle_action > 0 && energy >= s.getSettings().ENERGYCOST_OBSTACLE_C) {
            var my_t = s.getWorld().getTerrain(this.x_pos,this.y_pos);
            my_t.setObstacle(s.getSettings().OBSTACLETIME);
            this.addEnergy(-s.getSettings().ENERGYCOST_OBSTACLE_C);
        }

        if (energy >= s.getSettings().ENERGYCOST_FORK && age > s.getSettings().CHILDHOOD){
            if (this.getForkCondition()) {
                forked_ep = this.fork();
            }
        }

        return forked_ep
    };

    this.set_input = function() {
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
    }

    this.get_control_vals = function() {
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

    // HELP-Methods

    this.canMoveToField = function(t_new){
        if (t_new.getObstacle()>0){
            return false;
        }
        var obj_on_candidate_field = t_new.getSlotObject();
        return obj_on_candidate_field == null || (obj_on_candidate_field.getId() == OBJECTTYPES.EPROBOT_H);
    };

    this.getId = function(){
        return OBJECTTYPES.EPROBOT_C;
    };

    this.isAlive = function(){
        return this.getAge() < this.s.getSettings().LIFETIME_MAX_C;
    };

    this.preMove = function(t_new){
        var obj_on_candidate_field = t_new.getSlotObject();
        if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == OBJECTTYPES.EPROBOT_H) {
            // "eat"
            //if (obj_on_candidate_field.getEnergy()<(this.getEnergy()+50)){
                obj_on_candidate_field.kill();
                // neuer eprobot...
                this.addEnergy(this.s.getSettings().FOOD_ENERGY);
            //}
        }
    };

    this.getForkCondition = function(){
        return this.s.getEprobots_c().length < this.s.getEprobots_h().length;
    };

    this.fork = function(){
        // freie stelle suchen
        var point = this.s.getWorld().getFreeSpace(this.x_pos, this.y_pos);
        // nachwuchs erzeugen und an freie stelle setzen
        if (point != null){
            var new_dna = tools_mutate(this.s.getSettingVal("MUTATE_POSSIBILITY"),this.s.getSettingVal("MUTATE_STRENGTH"),this.getInitialProgram());

            //console.log("Carnivore fork");
            var forked_ep = new Carnivore(this.s, point.x, point.y, new_dna);
            this.addEnergy(-this.s.getSettings().ENERGYCOST_FORK);
            // nachwuchs anmelden
            return forked_ep;
        }else{
            return null;
        }
    };

    this.doAge = function(){
        this.incrAge();
    };

    // GETTER / SETTER

    this.getAge = function(){
        return age;
    }

    this.setAge = function(new_age){
        age = new_age;
    }

    this.incrAge = function(){
        age++;
    }

    this.addEnergy = function (number) {
        energy += number;
        if (energy < 0){
            energy = 0;
        }
    };

    this.getEnergy = function(){
        return energy;
    }

    this.setEnergy = function(new_energy){
        energy = new_energy;
    }

    this.getPos = function(){
        return {"x": this.x_pos, "y": this.y_pos}
    }

    this.setPos = function(new_x_pos, new_y_pos){
        this.x_pos = new_x_pos;
        this.y_pos = new_y_pos;
    }

    this.getInitialProgram = function(){
        return init_programm;
    }

    this.getWorkingProgram = function(){
        return working_programm;
    }

    this.toJSON = function() {
        return {
            id: this.getId(),
            age: age,
            energy: energy,
            x_pos: this.x_pos,
            y_pos: this.y_pos,
            init_programm: init_programm,
            working_programm: working_programm
        };
    };

    this.loadState = function(e_state) {
        age = e_state.age;
        energy = e_state.energy;
        working_programm = e_state.working_programm;
    };

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);

    var age = 0;
    var energy = 0;

    this.s = s;
    this.x_pos = x_pos;
    this.y_pos = y_pos;

    var working_programm = init_programm.slice(0);
}