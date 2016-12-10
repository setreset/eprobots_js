function Eprobot(s, kind, x_pos, y_pos, program){
    this.newStep = function(){
        var forked_ep = null;

        if (age < s.getSettings().LIFETIME){
            // set input
            if (s.getSettings().SENSE){
                this.set_input();
            }

            var control_vals = this.get_move();
            var control_val = control_vals[0];
            //var control_val = this.get_move_random();
            if (isFinite(control_val)){
                var move_action = Math.abs(control_val % DIRECTIONS.length+1);
            }else{
                console.log("Infinite: "+control_val);
                var move_action = 0; // do nothing
            }

            var rep_val = control_vals[1];
            if (isFinite(rep_val)){
                var rep_action = Math.abs(rep_val % 2);
            }else{
                var rep_action = 0; // do nothing
            }

            forked_ep = this.processAction(move_action, rep_action);
        }

        age++;
        return forked_ep;
    }

    this.processAction = function(move_action, rep_action){
        var forked_ep = null;
        if (rep_action==1) {
            //if (energy > 0) {
                var t = s.getWorld().getTerrain(x_pos, y_pos);
                t.addFruitfulness(500);
                age+=4;
                //energy--;
                //age++;
                //age++;
                //age++;
                //age++;
            //}
        }

        if (energy > 0){
            if (s.get_eprobots_count() < s.getSettings().OBJECT_COUNT) {
                forked_ep = this.fork();
                //age++;
            }
        }

        if (move_action == 0){ // do nothing
            //if (energy > 0){
            //    if (s.get_eprobots_count() < s.getSettings().OBJECT_COUNT) {
            //        forked_ep = this.fork();
            //    }
            //}
        }else{
            var coord__new = s.getWorld().getCoordinates(this, move_action-1);
            if (coord__new){
                var t_new = s.getWorld().getTerrain(coord__new[0],coord__new[1]);
                var obj_on_candidate_field = t_new.getSlotObject();

                // ist da auch nichts?
                if (this.canMoveToField(obj_on_candidate_field)){
                    this.preMove(obj_on_candidate_field);

                    // position verschieben
                    // alte position loeschen
                    var t_old = s.getWorld().getTerrain(x_pos, y_pos);
                    t_old.setSlotObject(null);
                    t_new.setSlotObject(this);
                    t_new.set_trace(this.getKind(), s.getSettings().TRACETIME);
                    this.setPos(coord__new[0],coord__new[1]);
                }
            }
        }
        return forked_ep
    };

    this.preMove = function(obj_on_candidate_field){

        if (kind==0){
            if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == OBJECTTYPES.ENERGY) {
                // "eat energy"
                s.getWorld().decr_energycount();
                // neuer eprobot...
                energy++;
            }
        }else if(kind==1){
            if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == OBJECTTYPES.EPROBOT && obj_on_candidate_field.getKind()==0) {
                obj_on_candidate_field.kill();
                // neuer eprobot...
                if (s.get_eprobots_count() < s.getSettings().OBJECT_COUNT) {
                    forked_ep = this.fork();
                }
            }
        }
    };

    this.kill = function(){
        age = s.getSettings().LIFETIME;
    }

    this.canMoveToField = function(obj_on_candidate_field){

        if (kind==0){
            return obj_on_candidate_field == null || obj_on_candidate_field.getId() == OBJECTTYPES.ENERGY;
        }else if(kind==1){
            return obj_on_candidate_field == null || (obj_on_candidate_field.getId() == OBJECTTYPES.EPROBOT && obj_on_candidate_field.getKind()==0);
        }
    };

    this.set_input = function(){
        var inputval = s.getWorld().get_environment_val(x_pos,y_pos);
        //console.log(inputval);
        var program_length = s.getSettings().PROGRAM_LENGTH;
        working_programm[program_length-3] = inputval.local_energycount;
        working_programm[program_length-4] = inputval.local_eprobotcount;
        working_programm[program_length-5] = inputval.local_fossilcount;
        working_programm[program_length-6] = inputval.local_tracecount_0;
        working_programm[program_length-7] = inputval.local_tracecount_1;
        working_programm[program_length-8] = inputval.local_fruitfulness;
        working_programm[program_length-9] = age;
        working_programm[program_length-10] = energy;
        working_programm[program_length-11] = x_pos;
        working_programm[program_length-12] = y_pos;

    }

    this.get_move_random = function(){
        var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
        //var action = 6;
        return action;
    }

    this.get_move = function(){
        //var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
        //var action = 6;
        //return action;

        tools_compute(working_programm);
        return [working_programm[s.getSettings().PROGRAM_LENGTH-1],working_programm[s.getSettings().PROGRAM_LENGTH-2]];
    }

    this.get_local_partner = function(kind){
        var eprobots = s.getEprobots(kind);
        var smallest_dist = s.getWorldWidth()/2;
        var cand = null;
        if (eprobots.length>0){
            for (var t=0;t<10;t++){
                var p = eprobots[tools_random(eprobots.length)];
                var p_pos = p.getPos();

                var dist_x = Math.abs(p_pos.x-x_pos);
                if (dist_x > s.getWorldWidth()/2){
                    dist_x= s.getWorldWidth()-dist_x;
                }

                var dist_y = Math.abs(p_pos.y-y_pos);
                if (dist_y > s.getWorldHeight()/2){
                    dist_y= s.getWorldHeight()-dist_y;
                }
                var dist = Math.sqrt(dist_x*dist_x+dist_y*dist_y);
                if (dist<smallest_dist){
                    smallest_dist = dist;
                    cand = p;
                }
            }
        }
        return cand;
    }

    this.fork = function(){
        // freie stelle suchen
        var point = s.getWorld().getFreeSpace(x_pos,y_pos);
        // nachwuchs erzeugen und an freie stelle setzen
        if (point != null){
            // sexuelle fortpflanzung?
            if (Math.random()<0.5 && false){
                var partner = this.get_local_partner(kind);

                if (partner){
                    //console.log("recombine");
                    var new_dna = tools_recombine(program, partner.getInitialProgram());
                }else{
                    //console.log("recombine fail");
                    var new_dna = tools_mutate(program);
                }
            }else{
                var new_dna = tools_mutate(program)
            }

            var forked_ep = new Eprobot(s, kind, point.x, point.y, new_dna);
            energy--;
            // nachwuchs anmelden
            return forked_ep;
        }else{
            return null;
        }
    }

    this.getAge = function(){
        return age;
    }

    this.getPos = function(){
        return {"x": x_pos, "y": y_pos}
    }

    this.setPos = function(new_x_pos, new_y_pos){
        x_pos = new_x_pos;
        y_pos = new_y_pos;
    }

    this.getId = function(){
        return OBJECTTYPES.EPROBOT;
    }

    this.getKind = function(){
        return kind;
    }

    this.getInitialProgram = function(){
        return program;
    }

    this.toJSON = function() {
        return {
            id: this.getId(),
            age: age,
            energy: energy,
            x_pos: x_pos,
            y_pos: y_pos,
            working_programm: working_programm
        };
    };

    this.loadState = function(e_state) {
        age = e_state.age;
        energy = e_state.energy;
    };

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var age = 0;
    var energy = 0;

    var working_programm = program.slice();
}