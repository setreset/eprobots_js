class Herbivore extends Eprobot {

    getId(){
        return OBJECTTYPES.EPROBOT_H;
    }

    // HELP-Methods

    canMoveToField(t_new){
        if (t_new.getObstacle()>0){
            return false;
        }
        var obj_on_candidate_field = t_new.getSlotObject();
        return obj_on_candidate_field == null || obj_on_candidate_field.getId() == OBJECTTYPES.FOOD;
    }

    preMove(t_new){
        var obj_on_candidate_field = t_new.getSlotObject();
        if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == OBJECTTYPES.FOOD) {
            // "eat energy"
            this.s.getWorld().decr_foodcount();
            // neuer eprobot...
            this.addEnergy(this.s.getSettings().FOOD_ENERGY);
        }
    }

    kill(){
        //console.log("Herbivore kill");
        this.setAge(this.s.getSettings().LIFETIME_MAX);
    }

    getForkCondition(){
        return this.s.getEprobots_h().length < this.s.getSettings().EPROBOTS_MAX;
    }

    fork(){
        // freie stelle suchen
        var point = this.s.getWorld().getFreeSpace(this.x_pos, this.y_pos);
        // nachwuchs erzeugen und an freie stelle setzen
        if (point != null){
            var new_dna = tools_mutate(this.s.getSettingVal("MUTATE_POSSIBILITY"),this.s.getSettingVal("MUTATE_STRENGTH"),this.init_programm);

            //console.log("Herbivore fork");
            var forked_ep = new Herbivore(this.s, point.x, point.y, new_dna);
            this.addEnergy(-this.s.getSettings().ENERGYCOST_FORK);
            // nachwuchs anmelden
            return forked_ep;
        }else{
            return null;
        }
    };

    isAlive(){
        return this.getAge() < this.s.getSettings().LIFETIME_MAX;
    }
}