function Eprobot(s, x_pos, y_pos){
    this.newStep = function(){
        var forked_ep = undefined;
        var action = tools_random(DIRECTIONS.length+1); // move directions + nothing
        if (action == DIRECTIONS.length){ // do nothing

        }else{
            forked_ep = this.move(action);
        }
        age++;
        return forked_ep;
    }

    this.move = function(action){
        var returncode = s.getWorld().moveObject(this, action);
        if (returncode === 1){
            return this.fork();
        }
    }

    this.fork = function(){
        // freie stelle suchen
        var point = s.getWorld().getFreeSpace(x_pos,y_pos);
        // nachwuchs erzeugen und an freie stelle setzen
        if (point != null){
            var forked_ep = new Eprobot(s, point.x,point.y);
            // nachwuchs anmelden
            return forked_ep;
        }else{
            return null;
        }
    }

    this.getAge = function(){
        return age;
    }

    this.getPos = function(){
        return {"x": x_pos, "y": y_pos}
    }

    this.setPos = function(new_x_pos, new_y_pos){
        x_pos = new_x_pos;
        y_pos = new_y_pos;
    }

    this.getId = function(){
        return LIFEFORMS.EPROBOT;
    }

    // init
    var t = s.getWorld().getTerrain(x_pos, y_pos);
    t.setSlotObject(this);
    var age = 0;
}