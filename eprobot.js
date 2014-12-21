function Eprobot(s, x_pos, y_pos){
    this.newStep = function(){
        var forked_ep = null;
        var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
        if (action == DIRECTIONS.length){ // do nothing

        }else{
            var movechoice = DIRECTIONS[action];
            var x_cand = borderjump_x(x_pos + movechoice.x);
            var y_cand = borderjump_y(y_pos + movechoice.y);

            var t = s.getWorld().getTerrain(x_cand,y_cand);
            var obj_on_candidate_field = t.getSlot();

            // ist da auch nichts?
            if (obj_on_candidate_field == null || obj_on_candidate_field == LIFEFORMS.ENERGY){
                // position verschieben
                // alte position loeschen
                s.getWorld().getTerrain(x_pos, y_pos).setSlot(null);
                t.setSlot(LIFEFORMS.EPROBOT);
                x_pos=x_cand;
                y_pos=y_cand;

                if (obj_on_candidate_field == LIFEFORMS.ENERGY){
                    //console.log("eat energy");
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

    // init
    s.getWorld().getTerrain(x_pos, y_pos).setSlot(LIFEFORMS.EPROBOT);
    var age = 0;
}