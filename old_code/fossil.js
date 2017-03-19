function Fossil(s, x_pos, y_pos){

    this.getId = function(){
        return OBJECTTYPES.FOSSIL;
    };

    this.getCreationTime = function(){
        return creation_time;
    };

    this.getPos = function(){
        return {"x": x_pos, "y": y_pos}
    };

    this.setPos = function(new_x_pos, new_y_pos){
        x_pos = new_x_pos;
        y_pos = new_y_pos;
    };

    this.toJSON = function() {
        return {
            id: this.getId(),
            creation_time: this.getCreationTime()
        };
    };

    this.loadState = function(fossilstate) {
        creation_time = fossilstate.creation_time;
    };

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var creation_time = s.getStepCounter();
}