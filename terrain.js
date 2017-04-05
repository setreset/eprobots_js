function Terrain(s){
    var slot_object = null;
    var traces = [0,0];
    var fruitfulness = 0;
    var obstacle = 0;
    var toxin = 0;

    this.decr_trace = function(kind){
        if (traces[kind]>0){
            traces[kind]-=1;
        }
    };

    this.get_trace = function(kind){
        return traces[kind];
    };

    this.set_trace = function(o_id, val){
        if (o_id==OBJECTTYPES.EPROBOT_H){
            var kind = 0;
        }else if (o_id==OBJECTTYPES.EPROBOT_C){
            var kind = 1;
        }
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

    this.decrObstacle = function(){
        if (obstacle > 0){
            obstacle--;
        }
    }

    this.getObstacle = function(){
        return obstacle;
    }

    this.getSlotObject = function(){
        return slot_object;
    };

    this.setSlotObject = function(val){
        slot_object = val;
    }

    this.setObstacle = function(val){
        obstacle = val;
    }

    this.getToxin = function(){
        return toxin;
    }

    this.setToxin = function(val){
        toxin = val;
    }

    this.addToxin = function(val){
        toxin += val;

        if (toxin > s.getSettings().TOXIN_MAX){
            toxin = s.getSettings().TOXIN_MAX;
        }
    }

    this.decrToxin = function(){
        if (toxin > 0){
            toxin--;
        }
    }

    this.toJSON = function() {
        var slotObject = this.getSlotObject();
        if (slotObject != null){
            if (slotObject.getId() == OBJECTTYPES.EPROBOT_H || slotObject.getId() == OBJECTTYPES.EPROBOT_C){
                slotObject = {
                    id: slotObject.getId()
                }
            }
        }
        return {
            slotObject: slotObject,
            fruitfulness: this.getFruitfulness(),
            trace_0: this.get_trace(0),
            trace_1: this.get_trace(1),
            obstacle: obstacle,
            toxin: toxin
        };
    }

    this.loadState = function(s, x, y, terrainstate){
        //console.log(terrainstate);
        fruitfulness = terrainstate.fruitfulness;
        traces[0] = terrainstate.trace_0;
        traces[1] = terrainstate.trace_1;
        obstacle = terrainstate.obstacle;
        toxin = terrainstate.toxin;

        var slot = terrainstate.slotObject;
        if (slot){
            if (slot.id == OBJECTTYPES.FOOD){
                var e = new Food(s, x, y);
                e.loadState(slot);
            }
        }
    }
}