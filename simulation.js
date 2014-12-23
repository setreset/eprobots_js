function Simulation(context2D, initial_settings){

    this.startSimulation = function(){
        console.log("start simulation");
        running = true;
        simulationStep();
    }

    this.stopSimulation = function(){
        console.log("stop simulation");
        running = false;
    }

    this.getRunning = function(){
        return running;
    }

    this.getEprobots = function(){
        return eprobots;
    }

    function simulationStep(){
        t_start = new Date().getTime();

        world.seedEnergy();
        draw();

        var eprobots_next = [];
        // processing
        for (var i=0;i<eprobots.length;i++){
            var eprobot = eprobots[i];
            if (eprobot.getAge() >= settings.LIFETIME){
                // aus map entfernen
                var e_pos = eprobot.getPos();

                var t = world.getTerrain(e_pos.x, e_pos.y);
                t.setSlotObject(null);
            }else{
                var forked_ep = eprobot.newStep();
                eprobots_next.push(eprobot);
                if (forked_ep != null){
                    eprobots_next.push(forked_ep);
                }
            }
        }

        eprobots = eprobots_next;
        stepcounter++;

        var t_end = new Date().getTime();
        var frame_time = t_end-t_start;
        //console.log("time: "+(t_end-t_start));
        if (running) setTimeout(simulationStep, settings.SLEEPTIME - frame_time);
    }

    function draw(){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);

        for (var x=0;x<settings.WORLD_WIDTH;x++){
            for (var y=0;y<settings.WORLD_HEIGHT;y++){
                var t = world.getTerrain(x,y);
                if (t.getSlotObject()==null){

                }else{
                    if (t.getSlotObject().getId()==LIFEFORMS.ENERGY){
                        var age = stepcounter - t.getSlotObject().getCreationTime();
                        var c_green = 256 - age;
                        if (c_green<0) c_green=0;
                        context2D.fillStyle = "rgb(0, "+c_green+", 0)";
                    }else if (t.getSlotObject().getId()==LIFEFORMS.EPROBOT){
                        var c_fac = Math.round(255/settings.LIFETIME)* t.getSlotObject().getAge();
                        context2D.fillStyle = "rgb(255, "+c_fac+", "+c_fac+")";
                    }
                    context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                }
            }
        }

    }

    this.getWorld = function(){
        return world;
    }

    this.getStepCounter = function(){
        return stepcounter;
    }

    this.getSettings = function(){
        return settings;
    }

    this.setSettings = function(val){
        settings = {
            WORLD_WIDTH: val.WORLD_WIDTH,
            WORLD_HEIGHT: val.WORLD_HEIGHT,
            OBJECT_COUNT: val.OBJECT_COUNT,
            LIFETIME : val.LIFETIME,
            SLEEPTIME: val.SLEEPTIME,
            ENERGY_BLOCK_TIME: val.ENERGY_BLOCK_TIME
        }
    }

    this.setSettingsLifetime = function(val){
      settings.LIFETIME = val;
    };

    // init

    var settings = null;
    this.setSettings(initial_settings);

    var t_start = null;
    var running = false;
    var stepcounter = 0;

    var x_step = canvas.width / settings.WORLD_WIDTH;
    var y_step = canvas.height / settings.WORLD_HEIGHT;

    var world = new World(this);

    var eprobots = [];
    eprobots.push(new Eprobot(this, 5, 5));
    eprobots.push(new Eprobot(this, 10, 10));
    //world.seedEnergy();
}