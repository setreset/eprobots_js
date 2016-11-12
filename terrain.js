function Terrain(){
    var slot_object = null;
    var traces = [0,0];
    var fruitfulness = 0;

    this.decr_trace = function(kind){
        if (traces[kind]>0){
            traces[kind]-=1;
        }
    };

    this.get_trace = function(kind){
        return traces[kind];
    };

    this.set_trace = function(kind, val){
        traces[kind] = val;
    };

    this.addFruitfulness = function(val){
        fruitfulness += val;

        if (fruitfulness > 1000){
            fruitfulness = 1000;
        }
    }

    this.decrFruitfulness = function(){
        if (fruitfulness>0){
            fruitfulness--;
        }
    }

    this.getFruitfulness = function(){
        return fruitfulness;
    }

    this.getSlotObject = function(){
        return slot_object;
    };

    this.setSlotObject = function(val){
        slot_object = val;
    }
}