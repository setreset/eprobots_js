function Eprobot(s, x_pos, y_pos){
    this.newStep = function(){

        var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
        if (action == DIRECTIONS.length){ // do nothing

        }else{
            var movechoice = DIRECTIONS[action];
            var x_cand = borderjump_x(x_pos + movechoice.x);
            var y_cand = borderjump_y(y_pos + movechoice.y);

            var t = s.getWorld().getTerrain(x_cand,y_cand);
            var obj_on_candidate_field = t.getSlot();

            // ist da auch nichts?
            if (obj_on_candidate_field == null){
                // alte position loeschen
                s.getWorld().getTerrain(x_pos, y_pos).setSlot(null);
                t.setSlot(1);
                x_pos=x_cand;
                y_pos=y_cand;
            }
        }
    }

    // init
    s.getWorld().getTerrain(x_pos, y_pos).setSlot(1);
}