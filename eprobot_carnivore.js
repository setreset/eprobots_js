class Carnivore extends Eprobot{

    getId(){
        return OBJECTTYPES.EPROBOT_C;
    }

    newStep(){
        var forked_ep = null;

        // set input
        if (this.s.getSettings().SENSE){
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

    processAction(move_action, obstacle_action){
        var forked_ep = null;

        if (move_action > 0){
            var coord__new = this.s.getWorld().getCoordinates(this, move_action-1);
            if (coord__new){
                var t_new = this.s.getWorld().getTerrain(coord__new[0],coord__new[1]);

                // ist da auch nichts?
                if (this.canMoveToField(t_new)){
                    this.preMove(t_new);

                    // position verschieben
                    // alte position loeschen
                    var t_old = this.s.getWorld().getTerrain(this.x_pos, this.y_pos);
                    t_old.setSlotObject(null);
                    t_new.setSlotObject(this);
                    t_new.set_trace(this.getId(), this.s.getSettings().TRACETIME);
                    this.setPos(coord__new[0],coord__new[1]);

                    if (t_new.getToxin()>0){
                        this.setAge(this.s.getSettings().LIFETIME_MAX_C);
                    }
                }
            }
        }

        if (obstacle_action > 0 && this.energy >= this.s.getSettings().ENERGYCOST_OBSTACLE_C) {
            var my_t = this.s.getWorld().getTerrain(this.x_pos,this.y_pos);
            my_t.setObstacle(this.s.getSettings().OBSTACLETIME);
            this.addEnergy(-this.s.getSettings().ENERGYCOST_OBSTACLE_C);
        }

        if (this.energy >= this.s.getSettings().ENERGYCOST_FORK && this.age > this.s.getSettings().CHILDHOOD){
            if (this.getForkCondition()) {
                forked_ep = this.fork();
            }
        }

        return forked_ep
    }

    // HELP-Methods

    canMoveToField(t_new){
        if (t_new.getObstacle()>0){
            return false;
        }
        var obj_on_candidate_field = t_new.getSlotObject();
        return obj_on_candidate_field == null || (obj_on_candidate_field.getId() == OBJECTTYPES.EPROBOT_H);
    }

    preMove(t_new){
        var obj_on_candidate_field = t_new.getSlotObject();
        if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == OBJECTTYPES.EPROBOT_H) {
            // "eat"
            //if (obj_on_candidate_field.getEnergy()<(this.getEnergy()+50)){
            obj_on_candidate_field.kill();
            // neuer eprobot...
            this.addEnergy(this.s.getSettings().FOOD_ENERGY);
            //}
        }
    }

    getForkCondition(){
        //return this.s.getEprobots_c().length < this.s.getEprobots_h().length;
        return this.s.getEprobots_c().length < this.s.getSettings().EPROBOTS_MAX;
        //return true;
    }

    fork(){
        // freie stelle suchen
        var point = this.s.getWorld().getFreeSpace(this.x_pos, this.y_pos);
        // nachwuchs erzeugen und an freie stelle setzen
        if (point != null){
            var new_dna = tools_mutate(this.s.getSettingVal("MUTATE_POSSIBILITY"),this.s.getSettingVal("MUTATE_STRENGTH"),this.init_programm);

            //console.log("Carnivore fork");
            var forked_ep = new Carnivore(this.s, point.x, point.y, new_dna);
            this.addEnergy(-this.s.getSettings().ENERGYCOST_FORK);
            // nachwuchs anmelden
            return forked_ep;
        }else{
            return null;
        }
    }

    isAlive(){
        return this.getAge() < this.s.getSettings().LIFETIME_MAX_C;
    }
}

