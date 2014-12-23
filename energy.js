function Energy(s, x_pos, y_pos){

    this.getId = function(){
        return LIFEFORMS.ENERGY;
    }

    this.getCreationTime = function(){
        return creation_time;
    }

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var creation_time = s.getStepCounter();
}