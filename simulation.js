function Simulation(canvas, initial_settings, initial_world_width, initial_world_height){

    this.startSimulation = function(){
        console.log("start simulation");
        running = true;

        // wasser
        if (GLOBAL_SETTINGS.WATER){
            var x_off = world_width/2;
            var y_off = world_width/2;
            //for (var r=0;r<25;r++){
            //    this.setWater_cicle(x_off, y_off, r);
            //}

            for (var l=10;l<=140;l=l+30){
                for (var x=75;x<=135;x++){
                    new WaterSource(this, x, l);
                }
            }
        }

        //draw();
        simulationStep();
    }

    this.setWater_circle = function(x0, y0, r){
        var d = r*-1;
        var x = r;
        var y = 0;

        while (y <= x){
            console.log(x+" "+y);
            new WaterSource(this, x0+x, y0+y); //sowie symmetrische Pixel einfärben
            new WaterSource(this, x0-x, y0+y);
            new WaterSource(this, x0-x, y0-y);
            new WaterSource(this, x0+x, y0-y);
            new WaterSource(this, x0+y, y0+x);
            new WaterSource(this, x0-y, y0+x);
            new WaterSource(this, x0-y, y0-x);
            new WaterSource(this, x0+y, y0-x);


            d = d + 2*y + 1;
            y = y + 1;
            if (d > 0){
                x = x - 1;
                d = d - 2*x;
            }
        }
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
        if (GLOBAL_SETTINGS.LOG_STATS){
            t_start = new Date().getTime();
        }

        //world.seedEnergy();
        draw();

        if (eprobots.length == 0){
            initEprobots();
        }

        var eprobots_next = [];
        // processing
        for (var i=0;i<eprobots.length;i++){
            var eprobot = eprobots[i];
            if (eprobot.getAge() >= settings.LIFETIME){
                // aus map entfernen
                var e_pos = eprobot.getPos();

                if (settings.FOSSILTIME > 0){
                    new Fossil(sim, eprobot.getKind(), e_pos.x, e_pos.y);
                }else{
                    var t = world.getTerrain(e_pos.x, e_pos.y);
                    t.setSlotObject(null);
                }
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

        if (GLOBAL_SETTINGS.LOG_STATS){
            var t_end = new Date().getTime();
            var frame_time = t_end-t_start;
            if (frame_time>t_max) t_max = frame_time;
            t_count = t_count + frame_time;
            var mean = t_count/stepcounter;
            mean = mean.toFixed(1);
            console.log("step: "+stepcounter+" time: "+frame_time+" mean: "+mean+" max: "+t_max);
        }

        if (running) setTimeout(simulationStep, settings.SLEEPTIME - frame_time);
    }

    function draw(){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);

        for (var x=0;x<world_width;x++){
            var px = x/world_width;
            px = 0.7 - Math.abs(Math.cos(px*Math.PI*2))*0.7;
            for (var y=0;y<world_height;y++){
                var t = world.getTerrain(x,y);
                var t_object = t.getSlotObject();

                if (t_object==null){

                    if (Math.random() < px){
                        t_object = new Energy(sim, x, y);
                    }
                }

                if (t_object != null){
                    if (t_object.getId()==OBJECTTYPES.ENERGY){
                        var age = stepcounter - t_object.getCreationTime();
                        var c_green = 256 - age;
                        if (c_green<100) c_green=100;
                        context2D.fillStyle = "rgb(0, "+c_green+", 0)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);

                    }else if (t_object.getId()==OBJECTTYPES.EPROBOT){
                        var c_fac = Math.round(tools_map_range(t_object.getAge(), 0, settings.LIFETIME, 255, 0));
                        context2D.fillStyle = "rgb("+c_fac+", 0, 0)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);

                    }else if (t_object.getId()==OBJECTTYPES.FOSSIL){
                        var age = stepcounter - t_object.getCreationTime();
                        var c_fac = Math.round(tools_map_range(age, 0, settings.FOSSILTIME, 360, 0));
                        var l_fac = Math.round(tools_map_range(age, 0, settings.FOSSILTIME, 0, 90));
                        context2D.fillStyle = "hsl("+c_fac+", 100%, "+l_fac+"%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);

                        if (age > settings.FOSSILTIME){
                            var f_pos = t_object.getPos();
                            var t = world.getTerrain(f_pos.x, f_pos.y);
                            t.setSlotObject(null);
                        }

                    }else if (t_object.getId()==OBJECTTYPES.WATER_SOURCE || t_object.getId()==OBJECTTYPES.WATER){
                        context2D.fillStyle = "rgb(0, 0, 255)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);

                    }
                }
            }
        }
    }

    function initEprobots(){
        var currentdate = new Date();
        console.log("init eprobots: " + currentdate);
        var program;

        for (var loop=0;loop<50;loop++){
            var x_pos, y_pos;
            x_pos = tools_random(world_width);
            y_pos = tools_random(world_height);

            var t_new = world.getTerrain(x_pos,y_pos);
            var obj_on_candidate_field = t_new.getSlotObject();

            // ist da auch nichts?
            if (obj_on_candidate_field == null || obj_on_candidate_field.getId() == OBJECTTYPES.ENERGY) {
                //console.log(x_pos, y_pos)

                program = [];
                for (var i = 0; i < GLOBAL_SETTINGS.PROGRAM_LENGTH; i++) {
                    var val = tools_random(300)-30;
                    program.push(val);
                }

                eprobots.push(new Eprobot(sim, 0, x_pos, y_pos, program));
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

    this.setSettingsFossiltime = function(val){
        settings.FOSSILTIME = val;
    };

    this.setSettingsEnergyBlockTime = function(val){
        settings.ENERGY_BLOCK_TIME = val;
    };

    this.setSettingsObjectCount = function(val){
        settings.OBJECT_COUNT = val;
    };

    this.setSettingsSleeptime = function(val){
        settings.SLEEPTIME = val;
    };

    this.setSettingsBreedtime = function(val){
        settings.BREEDTIME = val;
    };

    this.setSettingsEnergyWidth = function(val){
        settings.ENERGY_WIDTH = val;
    };

    this.resizeCanvas = function(){
        console.log("resizeCanvas");
        var rect = canvas.getBoundingClientRect();
        var c_w = rect.width;
        var c_h = rect.height;

        canvas.width = c_w; //$(simulation_canvas).width();
        canvas.height = c_h; //$(simulation_canvas).height();
        x_step = c_w / world_width;
        y_step = c_h / world_height;
    }

    // init
    var context2D = canvas.getContext('2d');
    var world_width = initial_world_width;
    var world_height = initial_world_height;
    var settings = null;
    this.setSettings(initial_settings);

    var t_start = null;
    var t_max = 0;
    var t_count = 0;
    var running = false;
    var stepcounter = 0;

    var x_step, y_step;
    this.resizeCanvas();

    var world = new World(this);

    var eprobots = [];

    var sim = this;
}