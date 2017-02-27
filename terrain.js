function Terrain(s){
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

        if (fruitfulness > s.getSettings().SEED_MAX){
            fruitfulness = s.getSettings().SEED_MAX;
        }
    }

    this.decrFruitfulness = function(){
        if (fruitfulness > 0){
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

    this.toJSON = function() {
        var slotObject = this.getSlotObject();
        if (slotObject != null){
            if (slotObject.getId() == OBJECTTYPES.EPROBOT){
                slotObject = {
                    id: OBJECTTYPES.EPROBOT
                }
            }
        }
        return {
            slotObject: slotObject,
            fruitfulness: this.getFruitfulness(),
            trace_0: this.get_trace(0),
            trace_1: this.get_trace(1)
        };
    }

    this.loadState = function(s, x, y, terrainstate){
        //console.log(terrainstate);
        fruitfulness = terrainstate.fruitfulness;
        traces[0] = terrainstate.trace_0;
        traces[1] = terrainstate.trace_1;

        var slot = terrainstate.slotObject;
        if (slot){
            if (slot.id == OBJECTTYPES.ENERGY){
                var e = new Energy(s, x, y);
                e.loadState(slot);
            }else if (slot.id == OBJECTTYPES.FOSSIL){
                var f = new Fossil(s, 0, x, y);
                f.loadState(slot);
            }
        }
    }
}