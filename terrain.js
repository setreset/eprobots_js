function Terrain(){
    var slot_object = null;
    var trace = 0;

    this.inc_trace = function(){
        trace++;
    };

    this.decr_trace = function(){
        trace-=4;
        if (trace<=0){
            trace=0.0;
        }
    };

    this.get_trace = function(){
        return trace;
    };

    this.set_trace = function(val){
        trace = val;
    };

    this.getSlotObject = function(){
        return slot_object;
    };

    this.setSlotObject = function(val){
        slot_object = val;
    }
}