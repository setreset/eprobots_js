function Terrain(){
    var slot_object = null;

    var last_energy_step = null;

    this.getSlotObject = function(){
        return slot_object;
    }

    this.setSlotObject = function(val){
        slot_object = val;
    }

    this.setLastEnergy = function(val){
        //console.log("set:"+val);
        last_energy_step = val;
    }

    this.getLastEnergy = function(){
        return last_energy_step;
    }
}