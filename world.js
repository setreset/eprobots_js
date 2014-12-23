function World(s){

    this.getTerrain = function(x, y){
        return worldarr[x][y];
    }

    this.seedEnergy = function(){
        var energydiff = s.getSettings().OBJECT_COUNT - (s.getEprobots().length + energy_count);

        for(var i=0;i<energydiff;i++){
            // zufaellige stelle
            var x = tools_random(s.getSettings().WORLD_WIDTH);
            var y = tools_random(s.getSettings().WORLD_HEIGHT);
            // ist sie frei?
            var t = this.getTerrain(x,y);
            if (t.getSlotObject() == null){
                var can_grow = true;

                if (s.getSettings().ENERGY_BLOCK_TIME != null){
                    if (t.getLastEnergy() != null){
                        // true wenn genug zeit verstrichen, false wenn nicht
                        can_grow = (s.getStepCounter()-t.getLastEnergy()) >= s.getSettings().ENERGY_BLOCK_TIME;
                    }
                }

                if (can_grow){
                    // neues energyobject
                    new Energy(s, x, y);
                    energy_count++;
                }else{
                    //console.log("no no no");
                }
            }
        }
    }

    this.getFreeSpace = function(x,y) {
        var pointarr = [];
        for (var i=0;i<DIRECTIONS.length;i++){
            var movechoice = DIRECTIONS[i];
            var x_cand = borderjump_x(x + movechoice.x, s.getSettings().WORLD_WIDTH);
            var y_cand = borderjump_y(y + movechoice.y, s.getSettings().WORLD_HEIGHT);
            if (this.getTerrain(x_cand,y_cand).getSlotObject() == null){
                pointarr.push({x: x_cand,y: y_cand});
            }
        }

        if (pointarr.length == 0){
            return null;
        }else{ // zufaelligen punkt auswaehlen und zurueckgeben
            return pointarr[tools_random(pointarr.length)];
        }
    }

    this.getEnergyCount = function(){
        return energy_count;
    }

    this.setEnergyCount = function(new_e){
        energy_count = new_e;
    }

    // init
    var worldarr = new Array(s.getSettings().WORLD_WIDTH);
    for (var x=0;x<s.getSettings().WORLD_WIDTH;x++){
        worldarr[x] = new Array(s.getSettings().WORLD_HEIGHT);
        for (var y=0;y<s.getSettings().WORLD_HEIGHT;y++){
            worldarr[x][y] = new Terrain();
        }
    }

    var energy_count = 0;
}

function Terrain(){
    var slot_object = null;

    var last_energy_step = null;

    this.getSlotObject = function(){
        return slot_object;
    }

    this.setSlotObject = function(val){
        slot_object = val;
    }

    this.setLastEnergy = function(val){
        //console.log("set:"+val);
        last_energy_step = val;
    }

    this.getLastEnergy = function(){
        return last_energy_step;
    }
}