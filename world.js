function World(s){

    this.getTerrain = function(x, y){
        return worldarr[x][y];
    }

    this.seedEnergy = function(){
        //var energydiff = s.getSettings().OBJECT_COUNT - (s.getEprobots().length + energy_count);
        var energydiff = s.getSettings().OBJECT_COUNT - energy_count;

        for(var i=0;i<energydiff;i++){
            // zufaellige stelle
            var x = tools_random(s.getWorldWidth());
            var y = tools_random(s.getWorldHeight());
            // ist sie frei?
            var t = this.getTerrain(x,y);
            if (t.getSlotObject() == null){
                // neues energyobject
                new Energy(s, x, y);
                energy_count++;
            }
        }
    }

    this.moveObject = function(object, action){
        var movechoice = DIRECTIONS[action];

        var objectpos = object.getPos();
        if (GLOBAL_SETTINGS.BORDERJUMP){
            var x_cand = borderjump_x(objectpos.x + movechoice.x, s.getWorldWidth());
            var y_cand = borderjump_y(objectpos.y + movechoice.y, s.getWorldHeight());
        }else{
            var x_cand = objectpos.x + movechoice.x;
            var y_cand = objectpos.y + movechoice.y;
            if (x_cand < 0 || x_cand >= s.getWorldWidth() || y_cand < 0 || y_cand >= s.getWorldHeight()) return;
        }

        var t_new = this.getTerrain(x_cand,y_cand);
        var obj_on_candidate_field = t_new.getSlotObject();

        // ist da auch nichts?
        if (obj_on_candidate_field == null || obj_on_candidate_field.getId() == LIFEFORMS.ENERGY){
            // position verschieben
            // alte position loeschen
            var t_old = s.getWorld().getTerrain(objectpos.x, objectpos.y);
            t_old.setSlotObject(null);
            t_new.setSlotObject(object);
            object.setPos(x_cand, y_cand);

            if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == LIFEFORMS.ENERGY){
                // "eat energy"
                this.setEnergyCount(this.getEnergyCount()-1);
                // neuer eprobot...
                return 1;
            }
        }
    }

    /*this.getFreeSpace = function(x,y) {
        var pointarr = [];
        for (var i=0;i<DIRECTIONS.length;i++){
            var movechoice = DIRECTIONS[i];
            var x_cand = borderjump_x(x + movechoice.x, s.getWorldWidth());
            var y_cand = borderjump_y(y + movechoice.y, s.getWorldHeight());
            if (this.getTerrain(x_cand,y_cand).getSlotObject() == null){
                pointarr.push({x: x_cand,y: y_cand});
            }
        }

        if (pointarr.length == 0){
            return null;
        }else{ // zufaelligen punkt auswaehlen und zurueckgeben
            return pointarr[tools_random(pointarr.length)];
        }
    }*/

    this.getFreeSpace = function(x,y) {

        for (var i=0;i<DIRECTIONS.length;i++){
            var movechoice = DIRECTIONS[tools_random(DIRECTIONS.length)];
            if (GLOBAL_SETTINGS.BORDERJUMP){
                var x_cand = borderjump_x(x + movechoice.x, s.getWorldWidth());
                var y_cand = borderjump_y(y + movechoice.y, s.getWorldHeight());
            }else{
                var x_cand = x + movechoice.x;
                var y_cand = y + movechoice.y;
                if (x_cand < 0 || x_cand >= s.getWorldWidth() || y_cand < 0 || y_cand >= s.getWorldHeight()) return null;
            }

            if (this.getTerrain(x_cand,y_cand).getSlotObject() == null){
                return {x: x_cand,y: y_cand};
            }
        }

        return null;
    }

    this.get_environment_val = function(x,y) {
        var local_energycount = 0;
        var local_eprobotcount = 0;
        var local_fossilcount = 0;
        for (var i=0;i<DIRECTIONS.length;i++){
            var movechoice = DIRECTIONS[i];
            if (GLOBAL_SETTINGS.BORDERJUMP){
                var x_cand = borderjump_x(x + movechoice.x, s.getWorldWidth());
                var y_cand = borderjump_y(y + movechoice.y, s.getWorldHeight());
            }else{
                var x_cand = x + movechoice.x;
                var y_cand = y + movechoice.y;
                if (x_cand < 0 || x_cand >= s.getWorldWidth() || y_cand < 0 || y_cand >= s.getWorldHeight()) continue;
            }
            var t = this.getTerrain(x_cand,y_cand);
            if (t.getSlotObject()!=null){
                if (t.getSlotObject().getId()==LIFEFORMS.ENERGY){
                    local_energycount++;
                }else if (t.getSlotObject().getId()==LIFEFORMS.EPROBOT){
                    local_eprobotcount++;
                }else if (t.getSlotObject().getId()==LIFEFORMS.FOSSIL){
                    local_fossilcount++;
                }
            }
        }

        return {
            local_energycount: local_energycount,
            local_eprobotcount: local_eprobotcount,
            local_fossilcount: local_fossilcount
        };
    }

    this.getEnergyCount = function(){
        return energy_count;
    }

    this.setEnergyCount = function(new_e){
        energy_count = new_e;
    }

    // init
    var worldarr = new Array(s.getWorldWidth());
    for (var x=0;x<s.getWorldWidth();x++){
        worldarr[x] = new Array(s.getWorldHeight());
        for (var y=0;y<s.getWorldHeight();y++){
            worldarr[x][y] = new Terrain();
        }
    }

    var energy_count = 0;
}