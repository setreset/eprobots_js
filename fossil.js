function Fossil(s, x_pos, y_pos){

    this.getId = function(){
        return LIFEFORMS.FOSSIL;
    }

    this.getCreationTime = function(){
        return creation_time;
    }

    this.getPos = function(){
        return {"x": x_pos, "y": y_pos}
    }

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var creation_time = s.getStepCounter();
}