function Energy(s, x_pos, y_pos){
    // init
    s.getWorld().getTerrain(x_pos, y_pos).setSlot(LIFEFORMS.ENERGY);
}