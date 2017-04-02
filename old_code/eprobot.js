function EprobotOld(s, x_pos, y_pos, init_programm){

    this.newStep = function(){
        var forked_ep = null;

        if (age < s.getSettings().LIFETIME_MAX){
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

            var rep_val = control_vals[1];
            if (isFinite(rep_val)){
                var rep_action = Math.abs(rep_val) % 2;
            }else{
                console.log("Infinite: "+rep_val);
                var rep_action = 0; // do nothing
            }

            var ocstacle_val = control_vals[2];
            if (isFinite(ocstacle_val)){
                var obstacle_action = Math.abs(ocstacle_val) % 9;
            }else{
                console.log("Infinite: "+ocstacle_val);
                var obstacle_action = 0; // do nothing
            }

            forked_ep = this.processAction(move_action, rep_action, obstacle_action);

            this.doAge();
        }

        return forked_ep;
    }

    this.processAction = function(move_action, rep_action, obstacle_action){
        var forked_ep = null;

        if (rep_action==1 && energy >= s.getSettings().ENERGYCOST_SEED) {
            var t = s.getWorld().getTerrain(this.x_pos, this.y_pos);
            t.addFruitfulness(s.getSettings().SEED_POWER);
            this.addEnergy(-s.getSettings().ENERGYCOST_SEED);
        }

        if (obstacle_action > 0 && energy >= s.getSettings().ENERGYCOST_OBSTACLE) {
            var coord__obstacle = s.getWorld().getCoordinates(this, obstacle_action-1);
            if (coord__obstacle){
                var t_obst = s.getWorld().getTerrain(coord__obstacle[0],coord__obstacle[1]);
                var obj_on_candidate_field = t_obst.getSlotObject();

                if (obj_on_candidate_field == null){
                    t_obst.setSlotObject(new Fossil(s, coord__obstacle[0],coord__obstacle[1]));
                }
                this.addEnergy(-s.getSettings().ENERGYCOST_SEED);
            }
        }

        if (energy >= s.getSettings().ENERGYCOST_FORK && age > s.getSettings().CHILDHOOD){
            if (this.getForkCondition()) {
                forked_ep = this.fork();
            }
        }

        if (move_action > 0){
            var coord__new = s.getWorld().getCoordinates(this, move_action-1);
            if (coord__new){
                var t_new = s.getWorld().getTerrain(coord__new[0],coord__new[1]);
                var obj_on_candidate_field = t_new.getSlotObject();

                // ist da auch nichts?
                if (this.canMoveToField(obj_on_candidate_field)){
                    this.preMove(obj_on_candidate_field);

                    // position verschieben
                    // alte position loeschen
                    var t_old = s.getWorld().getTerrain(this.x_pos, this.y_pos);
                    t_old.setSlotObject(null);
                    t_new.setSlotObject(this);
                    t_new.set_trace(this.getId(), s.getSettings().TRACETIME);
                    this.setPos(coord__new[0],coord__new[1]);
                }
            }
        }else{ // do nothing
        }
        return forked_ep
    };

    this.set_input = function(){
        var inputval = s.getWorld().get_environment_val(this.x_pos,this.y_pos);
        //console.log(inputval);
        var program_length = s.getSettings().PROGRAM_LENGTH;

        working_programm[program_length-4] = inputval.local_foodcount;
        working_programm[program_length-5] = inputval.local_eprobotcount_0;
        working_programm[program_length-6] = inputval.local_eprobotcount_1;
        working_programm[program_length-7] = inputval.local_fossilcount;
        working_programm[program_length-8] = inputval.local_tracecount_0;
        working_programm[program_length-9] = inputval.local_tracecount_1;
        working_programm[program_length-10] = inputval.local_fruitfulness;

        working_programm[program_length-11] = age;
        working_programm[program_length-12] = energy;
        working_programm[program_length-13] = this.x_pos;
        working_programm[program_length-14] = this.y_pos;

    }

    this.get_move_random = function(){
        var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
        //var action = 6;
        return action;
    }

    this.get_control_vals = function(){
        //var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
        //var action = 6;
        //return action;

        tools_compute(working_programm);
        return [
            working_programm[s.getSettings().PROGRAM_LENGTH-1],
            working_programm[s.getSettings().PROGRAM_LENGTH-2],
            working_programm[s.getSettings().PROGRAM_LENGTH-3]];
    }

    //this.get_local_partner = function(kind){
    //    var eprobots = s.getEprobots(kind);
    //    var smallest_dist = s.getWorldWidth()/2;
    //    var cand = null;
    //    if (eprobots.length>0){
    //        for (var t=0;t<10;t++){
    //            var p = eprobots[tools_random(eprobots.length)];
    //            var p_pos = p.getPos();
    //
    //            var dist_x = Math.abs(p_pos.x-this.x_pos);
    //            if (dist_x > s.getWorldWidth()/2){
    //                dist_x= s.getWorldWidth()-dist_x;
    //            }
    //
    //            var dist_y = Math.abs(p_pos.y-y_pos);
    //            if (dist_y > s.getWorldHeight()/2){
    //                dist_y= s.getWorldHeight()-dist_y;
    //            }
    //            var dist = Math.sqrt(dist_x*dist_x+dist_y*dist_y);
    //            if (dist<smallest_dist){
    //                smallest_dist = dist;
    //                cand = p;
    //            }
    //        }
    //    }
    //    return cand;
    //}

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
    var energy = null;

    this.s = s;
    this.x_pos = x_pos;
    this.y_pos = y_pos;

    var working_programm = init_programm.slice(0);
}

// https://developer.mozilla.org/de/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript