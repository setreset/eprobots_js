function World(s){

    this.getTerrain = function(x, y){
        return worldarr[x][y];
    }

    this.seedEnergy = function(){
        //var energydiff = s.getSettings().OBJECT_COUNT - (s.getEprobots().length + energy_count);
        var energydiff = s.getSettings().OBJECT_COUNT - energy_count;

        var energy_width = s.getSettings().ENERGY_WIDTH;
        if (energy_width=="MAX"){
            energy_width = s.getWorldWidth();
        }else{
            energy_width = parseInt(energy_width);
        }

        for(var x=0;x<energy_width;x++){

            for (var i=0;i<(energydiff/energy_width)-(x/12);i++){
                // zufaellige stelle
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
    }

    this.moveObject = function(object, direction){
        var movechoice = DIRECTIONS[direction];

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

        if (object.getId()==OBJECTTYPES.EPROBOT){
            // ist da auch nichts?
            if (obj_on_candidate_field == null || obj_on_candidate_field.getId() == OBJECTTYPES.ENERGY || obj_on_candidate_field.getId() == OBJECTTYPES.WATER){
                // position verschieben
                // alte position loeschen
                var t_old = s.getWorld().getTerrain(objectpos.x, objectpos.y);
                t_old.setSlotObject(null);
                t_new.setSlotObject(object);
                object.setPos(x_cand, y_cand);

                if (obj_on_candidate_field != null) {
                    if (obj_on_candidate_field.getId() == OBJECTTYPES.ENERGY) {
                        // "eat energy"
                        this.decrEnergyCount();
                        // neuer eprobot...
                        if (GLOBAL_SETTINGS.WATER){
                            var w_check = object.getWater() > 0;
                        }else{
                            var w_check = true;
                        }
                        if (object.getAge() > s.getSettings().BREEDTIME && w_check /*&& s.getEprobots().length < 2000*/) {
                            return 1;
                        }
                    }else if (obj_on_candidate_field.getId() == OBJECTTYPES.WATER) {
                        object.incrWater();
                    }
                }

            }else if (obj_on_candidate_field.getId() == OBJECTTYPES.WATER_SOURCE){
                object.incrWater();

            }else if (obj_on_candidate_field.getId() == OBJECTTYPES.FOSSIL){
                //object.incrWater();
                //this.moveObject(obj_on_candidate_field, direction);
            }

        }else if (object.getId()==OBJECTTYPES.FOSSIL){
            if (obj_on_candidate_field == null){
                console.log("verschiebe fossil");
                // position verschieben
                // alte position loeschen
                var t_old = s.getWorld().getTerrain(objectpos.x, objectpos.y);
                t_old.setSlotObject(null);
                t_new.setSlotObject(object);
                object.setPos(x_cand, y_cand);

            }else if (obj_on_candidate_field.getId() == OBJECTTYPES.FOSSIL){
                //object.incrWater();
                this.moveObject(obj_on_candidate_field, direction);
            }
        }

    }

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
        var local_watersourcecount = 0;
        var local_watercount = 0;

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
                if (t.getSlotObject().getId()==OBJECTTYPES.ENERGY){
                    local_energycount++;
                }else if (t.getSlotObject().getId()==OBJECTTYPES.EPROBOT){
                    local_eprobotcount++;
                }else if (t.getSlotObject().getId()==OBJECTTYPES.FOSSIL){
                    local_fossilcount++;
                }else if (t.getSlotObject().getId()==OBJECTTYPES.WATER_SOURCE){
                    local_watersourcecount++;
                }else if (t.getSlotObject().getId()==OBJECTTYPES.WATER){
                    local_watercount++;
                }
            }
        }

        return {
            local_energycount: local_energycount,
            local_eprobotcount: local_eprobotcount,
            local_fossilcount: local_fossilcount,
            local_watersourcecount: local_watersourcecount,
            local_watercount: local_watercount
        };
    }

    this.getEnergyCount = function(){
        return energy_count;
    }

    this.setEnergyCount = function(new_e){
        energy_count = new_e;
    }

    this.decrEnergyCount = function(){
        energy_count--;
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