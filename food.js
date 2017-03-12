function Food(s, x_pos, y_pos){

    this.getId = function(){
        return OBJECTTYPES.FOOD;
    }

    this.getCreationTime = function(){
        return creation_time;
    }

    this.toJSON = function() {
        return {
            id: this.getId(),
            creation_time: this.getCreationTime()
        };
    };

    this.loadState = function(energystate) {
        creation_time = energystate.creation_time;
    };

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var creation_time = s.getStepCounter();
}