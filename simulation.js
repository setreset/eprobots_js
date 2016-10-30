function Simulation(canvas, initial_settings, initial_world_width, initial_world_height){

    this.startSimulation = function(){
        console.log("start simulation");
        running = true;

        //draw();
        simulationStep();
    }

    this.stopSimulation = function(){
        console.log("stop simulation");
        running = false;
    }

    this.getRunning = function(){
        return running;
    }

    this.getEprobots = function(kind){
        return eprobots[kind];
    }

    this.get_eprobots_count = function(){
        var sum = 0;
        for (var i=0;i<eprobots.length;i++){
            sum += eprobots[i].length;
        }
        return sum;
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

        world.seedEnergy();
        //world.seedEnergy_tile();
        draw();

        for (var i=0; i<eprobots.length;i++){
            if (eprobots[i].length==0){
                beep();
                initEprobots(i);
            }

            processEprobots(i);
        }

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

    function processEprobots(kind){
        var eprobots_next = [];

        var ep = eprobots[kind];

        // processing
        for (var i=0;i<ep.length;i++){
            var eprobot = ep[i];
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
                if (forked_ep != null){
                    eprobots_next.push(forked_ep);
                }

                eprobots_next.push(eprobot);
            }
        }

        eprobots[kind] = eprobots_next;
    }

    function draw(){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);

        for (var x=0;x<world_width;x++){
            for (var y=0;y<world_height;y++){
                var t = world.getTerrain(x,y);
                var t_object = t.getSlotObject();

                if (t_object != null){
                    if (t_object.getId()==OBJECTTYPES.ENERGY){
                        //var age = stepcounter - t_object.getCreationTime();
                        //var c_green = 256 - age;
                        //if (c_green<100) c_green=100;
                        //context2D.fillStyle = "rgb(0, "+c_green+", 0)";
                        context2D.fillStyle = "rgb(0, 255, 0)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);

                    }else if (t_object.getId()==OBJECTTYPES.EPROBOT){
                        //var c_fac = Math.round(tools_map_range(t_object.getAge(), 0, settings.LIFETIME, 255, 0));
                        //context2D.fillStyle = "rgb("+c_fac+", 0, 0)";
                        if (t_object.getKind()==0){
                            context2D.fillStyle = "rgb(255, 0, 0)";
                            context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                        }else if(t_object.getKind()==1){
                            context2D.fillStyle = "rgb(0, 0, 255)";
                            context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                        }


                    }else if (t_object.getId()==OBJECTTYPES.FOSSIL){
                        var fossil_age = stepcounter - t_object.getCreationTime();
                        var c_fac = Math.round(tools_map_range(fossil_age, 0, settings.FOSSILTIME, 360, 0));
                        var l_fac = Math.round(tools_map_range(fossil_age, 0, settings.FOSSILTIME, 0, 90));
                        context2D.fillStyle = "hsl("+c_fac+", 0%, "+l_fac+"%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);

                        if (fossil_age > settings.FOSSILTIME){
                            //var f_pos = t_object.getPos();
                            //var t = world.getTerrain(f_pos.x, f_pos.y);
                            t.setSlotObject(null);
                        }

                    }
                }else{
                    //var age = stepcounter - t_object.getCreationTime();
                    //var c_green = 256 - age;
                    //if (c_green<100) c_green=100;

                    var trace_val_0 = t.get_trace(0);
                    var trace_val_1 = t.get_trace(1);
                    if (trace_val_0 > 0 && trace_val_1 == 0) {
                        var l_val = Math.round(tools_map_range(trace_val_0, 0, settings.TRACETIME, 90, 45));
                        context2D.fillStyle = "hsl(0, 52%, " + l_val + "%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }else if (trace_val_1 > 0 && trace_val_0 == 0) {
                        var l_val = Math.round(tools_map_range(trace_val_1, 0, settings.TRACETIME, 90, 45));
                        context2D.fillStyle = "hsl(194, 52%, " + l_val + "%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }
                    else if (trace_val_0 > 0 && trace_val_1 > 0){
                        var h0 = 0;
                        var s0 = 0.52;
                        var l0 = tools_map_range(trace_val_0, 0, 64, 0.9, 0.45);

                        var h1 = 0.54;
                        var s1 = 0.52;
                        var l1 = tools_map_range(trace_val_1, 0, 64, 0.9, 0.45);

                        var rgb0 = hslToRgb(h0, s0, l0);
                        var rgb1 = hslToRgb(h1, s1, l1);
                        var rgb_all = merge_colors(rgb0, rgb1);

                        //console.log(rgb_all);
                        context2D.fillStyle = "rgb("+rgb_all[0]+", "+rgb_all[1]+", "+rgb_all[2]+")";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }
                }

                t.decr_trace(0);
                t.decr_trace(1);
            }
        }
    }

    function initEprobots(kind){
        var currentdate = new Date();
        console.log("init eprobots: " + currentdate);
        var program;

        for (var loop=0;loop<25;loop++){
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

                var newep = new Eprobot(sim, kind, x_pos, y_pos, program);
                eprobots[kind].push(newep);
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

    var eprobots = [[],[]];
    //var eprobots = [[],[]];

    var sim = this;
}