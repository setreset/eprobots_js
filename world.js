function World(s){

    this.getTerrain = function(x, y){
        return worldarr[x][y];
    }

    this.seedEnergy = function(){
        //var energydiff = s.getSettings().OBJECT_COUNT - (s.getEprobots().length + energy_count);
        var energydiff = energycount_max - energy_count;

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

    this.seedEnergy_tile = function(){
        for (var tile_x=0;tile_x< tiles.length; tile_x++){
            for (var tile_y=0;tile_y<tiles[tile_x].length;tile_y++){
                if (tiles[tile_x][tile_y]==1){
                    this.seedEnergy_one_tile(tile_x,tile_y);
                }
            }
        }
        if (s.getStepCounter()%250==0){
            console.log("get_tiles")
            tiles = this.get_tiles();
        }
    };

    this.seedEnergy_one_tile = function(tile_x, tile_y){
        var energydiff = energycount_max - energy_count
        var energydiff_one_tile = energydiff/(tile_count*tile_count*0.5);

        //koordinaten errechnen
        var tile_width = parseInt(s.getWorldWidth() / tile_count, 10);
        var tile_height = parseInt(s.getWorldHeight() / tile_count, 10);
        var x_start = tile_x * tile_width;
        var y_start = tile_y * tile_height;

        for(var i=0;i<energydiff_one_tile;i++){
            var x = tools_random(tile_width) + x_start;
            var y = tools_random(tile_height) + y_start;
            // ist sie frei?
            var t = this.getTerrain(x,y);
            if (t.getSlotObject() == null){
                // neues energyobject
                new Energy(s, x, y);
                energy_count++;
            }
        }
    }

    this.get_tiles = function(){
        var tile_arr = new Array(tile_count);
        for (var x=0;x<tile_arr.length;x++){
            tile_arr[x] = new Array(tile_count);
            for (var y=0;y<tile_arr[x].length;y++){
                tile_arr[x][y] = tools_random(2);
            }
        }
        return tile_arr;
    };

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

        // ist da auch nichts?
        if (obj_on_candidate_field == null || obj_on_candidate_field.getId() == OBJECTTYPES.ENERGY){
            if (object.getKind()==0 && t_new.get_trace(1)>0){
                return
            }
            if (object.getKind()==1 && t_new.get_trace(0)>0){
                return
            }
            // position verschieben
            // alte position loeschen
            var t_old = s.getWorld().getTerrain(objectpos.x, objectpos.y);
            t_old.setSlotObject(null);
            t_new.setSlotObject(object);
            t_new.set_trace(object.getKind(),64);
            object.setPos(x_cand, y_cand);

            if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == OBJECTTYPES.ENERGY) {
                // "eat energy"
                energy_count--;
                // neuer eprobot...
                if (object.getAge() > s.getSettings().BREEDTIME && s.get_eprobots_count() < s.getSettings().OBJECT_COUNT) {
                    return 1;
                }
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
        var local_tracecount = 0;

        var t = this.getTerrain(x,y);
        local_tracecount += t.get_trace();

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
            local_tracecount += t.get_trace();

            if (t.getSlotObject()!=null){
                if (t.getSlotObject().getId()==OBJECTTYPES.ENERGY){
                    local_energycount++;
                }else if (t.getSlotObject().getId()==OBJECTTYPES.EPROBOT){
                    local_eprobotcount++;
                }else if (t.getSlotObject().getId()==OBJECTTYPES.FOSSIL){
                    local_fossilcount++;
                }
            }
        }

        return {
            local_energycount: local_energycount,
            local_eprobotcount: local_eprobotcount,
            local_fossilcount: local_fossilcount,
            local_tracecount: local_tracecount
        };
    }

    // init
    var worldarr = new Array(s.getWorldWidth());
    for (var x=0;x<s.getWorldWidth();x++){
        worldarr[x] = new Array(s.getWorldHeight());
        for (var y=0;y<s.getWorldHeight();y++){
            worldarr[x][y] = new Terrain();
        }
    }

    var energy_factor = 4.5;
    var energycount_max = parseInt((s.getWorldWidth()* s.getWorldHeight()) / energy_factor, 10);
    console.log("energycount_max: "+ energycount_max);
    var energy_count = 0;

    var tile_count = 3;
    var tiles = this.get_tiles();
}