function Simulation(canvas, initial_settings, initial_world_width, initial_world_height){

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

    this.getWorldWidth = function(){
        return world_width;
    }

    this.getWorldHeight = function(){
        return world_height;
    }

    this.getContext2D = function(){
        return context2D;
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
                if (forked_ep != undefined){
                    eprobots_next.push(forked_ep);
                }
            }
        }

        eprobots = eprobots_next;
        stepcounter++;

        if (eprobots.length==0){
            initEprobots();
        }

        var t_end = new Date().getTime();
        var frame_time = t_end-t_start;
        //console.log("time: "+(t_end-t_start));
        if (running) setTimeout(simulationStep, GLOBAL_SETTINGS.SLEEPTIME - frame_time);
    }

    function draw(){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);

        for (var x=0;x<world_width;x++){
            for (var y=0;y<world_height;y++){
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

    function initEprobots(){
        //console.log("initeprobots");
        var program;

        for (var loop=0;loop<20;loop++){
            var x_pos, y_pos;
            x_pos = tools_random(world_width);
            y_pos = tools_random(world_height);

            var t_new = world.getTerrain(x_pos,y_pos);
            var obj_on_candidate_field = t_new.getSlotObject();

            // ist da auch nichts?
            if (obj_on_candidate_field == null) {
                //console.log(x_pos, y_pos)

                program = [];
                for (var i = 0; i < 30; i++) {
                    var val = tools_random(300);
                    program.push(val);
                }

                eprobots.push(new Eprobot(sim, x_pos, y_pos, program));
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
        settings = $.extend({}, val);
    }

    this.setSettingsLifetime = function(val){
      settings.LIFETIME = val;
    };

    this.setSettingsEnergyBlockTime = function(val){
        settings.ENERGY_BLOCK_TIME = val;
    };

    this.setSettingsObjectCount = function(val){
        settings.OBJECT_COUNT = val;
    };

    // init
    var context2D = canvas.getContext('2d');
    var world_width = initial_world_width;
    var world_height = initial_world_height;
    var settings = null;
    this.setSettings(initial_settings);

    var t_start = null;
    var running = false;
    var stepcounter = 0;

    var x_step = canvas.width / world_width;
    var y_step = canvas.height / world_height;

    var world = new World(this);

    var eprobots = [];
    var sim = this;

    initEprobots();
    //eprobots.push(new Eprobot(this, 10, 10));
    //world.seedEnergy();
}