function Eprobot(s, x_pos, y_pos){
    this.newStep = function(){
        var forked_ep = null;
        var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
        if (action == DIRECTIONS.length){ // do nothing

        }else{
            var movechoice = DIRECTIONS[action];
            var x_cand = borderjump_x(x_pos + movechoice.x, s.getWorldWidth());
            var y_cand = borderjump_y(y_pos + movechoice.y, s.getWorldHeight());

            var t_new = s.getWorld().getTerrain(x_cand,y_cand);
            var obj_on_candidate_field = t_new.getSlotObject();

            // ist da auch nichts?
            if (obj_on_candidate_field == null || obj_on_candidate_field.getId() == LIFEFORMS.ENERGY){
                // position verschieben
                // alte position loeschen
                var t_old = s.getWorld().getTerrain(x_pos, y_pos);
                t_old.setSlotObject(null);
                t_new.setSlotObject(this);
                x_pos = x_cand;
                y_pos = y_cand;

                if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == LIFEFORMS.ENERGY){
                    if (s.getSettings().ENERGY_BLOCK_TIME != null){
                        t_new.setLastEnergy(s.getStepCounter());
                    }

                    // "eat energy"
                    s.getWorld().setEnergyCount(s.getWorld().getEnergyCount()-1);
                    // neuer eprobot
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
            var forked_ep = new Eprobot(s, point.x,point.y);
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

    this.getId = function(){
        return LIFEFORMS.EPROBOT;
    }

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var age = 0;
}