function World(x_size, y_size){

    this.getTerrain = function(x, y){
        return worldarr[x][y];
    }

    // init
    var worldarr = new Array(x_size);
    for (var x=0;x<x_size;x++){
        worldarr[x] = new Array(y_size);
        for (var y=0;y<y_size;y++){
            worldarr[x][y] = new Terrain();
        }
    }
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