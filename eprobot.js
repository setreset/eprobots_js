function Eprobot(s, kind, x_pos, y_pos, program){
    this.newStep = function(){
        var forked_ep = undefined;

        if (age < s.getSettings().LIFETIME){
            // set input
            if (GLOBAL_SETTINGS.SENSE){
                this.set_input();
            }

            var control_val = this.get_move();
            if (isFinite(control_val)){
                var action = Math.abs(control_val % DIRECTIONS.length+1);
            }else{
                console.log("Infinite: "+control_val);
                var action = DIRECTIONS.length; // do nothing
            }

            if (action == DIRECTIONS.length){ // do nothing
            }else{
                var returncode = s.getWorld().moveObject(this, action);
                if (returncode === 1){
                    forked_ep = this.fork();
                }
            }
        }

        age++;
        return forked_ep;
    }

    this.set_input = function(){
        //var inputval = s.getWorld().get_environment_val(x_pos,y_pos);
        ////console.log(inputval);
        //working_programm[GLOBAL_SETTINGS.PROGRAM_LENGTH-2] = inputval.local_energycount;
        //working_programm[GLOBAL_SETTINGS.PROGRAM_LENGTH-3] = inputval.local_eprobotcount;
        //working_programm[GLOBAL_SETTINGS.PROGRAM_LENGTH-4] = inputval.local_fossilcount;
        //working_programm[GLOBAL_SETTINGS.PROGRAM_LENGTH-5] = inputval.local_tracecount;
    }

    this.get_move = function(){
        //var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
        //var action = 6;
        tools_compute(working_programm);
        return working_programm[GLOBAL_SETTINGS.PROGRAM_LENGTH-1];
    }

    this.get_local_partner = function(){
        var eprobots = s.getEprobots();
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
                var partner = this.get_local_partner();

                if (partner && partner.getKind()==kind){
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


    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var age = 0;

    var working_programm = program.slice();
}