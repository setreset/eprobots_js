function Energy(s, x_pos, y_pos){

    this.getId = function(){
        return LIFEFORMS.ENERGY;
    }

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
}