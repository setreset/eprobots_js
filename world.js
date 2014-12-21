function World(s){

    this.getTerrain = function(x, y){
        return worldarr[x][y];
    }

    this.setEnergy = function(){
        var energydiff = SETTINGS.OBJECT_COUNT - (s.eprobots.length + energy_count);

        for(var i=0;i<energydiff;i++){
            // zufaellige stelle
            var x = tools_random(SETTINGS.WORLD_WIDTH);
            var y = tools_random(SETTINGS.WORLD_HEIGHT);
            // ist sie frei?
            if (this.getTerrain(x,y).getSlot() == null){
                // neues energyobject
                new Energy(s, x, y);
                energy_count++;
            }
        }
    }

    // init
    var worldarr = new Array(SETTINGS.WORLD_WIDTH);
    for (var x=0;x<SETTINGS.WORLD_WIDTH;x++){
        worldarr[x] = new Array(SETTINGS.WORLD_HEIGHT);
        for (var y=0;y<SETTINGS.WORLD_HEIGHT;y++){
            worldarr[x][y] = new Terrain();
        }
    }

    var energy_count = 0;
}

function Terrain(){
    var slot = null;

    this.getSlot = function(){
        return slot;
    }

    this.setSlot = function(val){
        slot = val;
    }
}