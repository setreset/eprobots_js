class Carnivore extends Eprobot{

    constructor(s, x_pos, y_pos, init_programm) {
        super(s, x_pos, y_pos, init_programm);
        this.energy = s.getSettings().START_ENERGY_C;
    }

    getId(){
        return OBJECTTYPES.EPROBOT_C;
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
            obj_on_candidate_field.setEnergy(0);
            // neuer eprobot...
            this.addEnergy(this.s.getSettings().FOOD_ENERGY_C);
            //}
        }else{
            if (t_new.getToxin()>0){
                this.addEnergy(-50);
            }
        }
    }

    getForkCondition(){
        //return this.s.getEprobots_c().length < this.s.getEprobots_h().length;
        return this.energy >= this.s.getSettings().ENERGYCOST_FORK_C && this.s.getEprobots_c().length < this.s.getSettings().EPROBOTS_MAX;
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
            this.addEnergy(-this.s.getSettings().ENERGYCOST_FORK_C);
            // nachwuchs anmelden
            return forked_ep;
        }else{
            return null;
        }
    }

    isAlive(){
        return this.getEnergy() > 0 && this.getAge() < this.s.getSettings().LIFETIME_MAX_C;
    }
}

