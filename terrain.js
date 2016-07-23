function Terrain(){
    var slot_object = null;

    this.getSlotObject = function(){
        return slot_object;
    }

    this.setSlotObject = function(val){
        slot_object = val;
    }
}