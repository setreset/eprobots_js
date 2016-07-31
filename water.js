function WaterSource(s, x_pos, y_pos){

    this.getId = function(){
        return OBJECTTYPES.WATER_SOURCE;
    }

    this.getCreationTime = function(){
        return creation_time;
    }

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var creation_time = s.getStepCounter();
}

function Water(s, x_pos, y_pos){

    this.getId = function(){
        return OBJECTTYPES.WATER;
    }

    this.getCreationTime = function(){
        return creation_time;
    }

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var creation_time = s.getStepCounter();
}