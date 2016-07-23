function Eprobot(s, kind, x_pos, y_pos, program){
    this.newStep = function(){
        var forked_ep = undefined;

        if (age < s.getSettings().LIFETIME){
            //var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
            //var action = 6;
            // set input
            var inputval = s.getWorld().get_environment_val(x_pos,y_pos);
            //console.log(inputval);
            working_programm[GLOBAL_SETTINGS.PROGRAM_LENGTH-2] = inputval.local_energycount;
            working_programm[GLOBAL_SETTINGS.PROGRAM_LENGTH-3] = inputval.local_eprobotcount;
            working_programm[GLOBAL_SETTINGS.PROGRAM_LENGTH-4] = inputval.local_fossilcount;
            tools_compute(working_programm);
            var control_val = working_programm[GLOBAL_SETTINGS.PROGRAM_LENGTH-1];
            if (isFinite(control_val)){
                var action = Math.abs(control_val % DIRECTIONS.length+1);
            }else{
                console.log("Infinite: "+control_val);
                var action = DIRECTIONS.length; // do nothing
            }

            //console.log(action);

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

    this.fork = function(){
        // freie stelle suchen
        var point = s.getWorld().getFreeSpace(x_pos,y_pos);
        // nachwuchs erzeugen und an freie stelle setzen
        if (point != null){
            // sexuelle fortpflanzung?
            if (Math.random()<0.1){
                var eprobots = s.getEprobots();
                var partner = eprobots[tools_random(eprobots.length)];
                if (partner.getKind()==kind){
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
        return LIFEFORMS.EPROBOT;
    }

    this.getKind = function(){
        return kind;
    }

    this.getWorkingProgram = function(){
        return working_programm;
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