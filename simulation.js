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

                if (settings.FOSSILTIME > 0){
                    fossils.push(new Fossil(sim, eprobot.getKind(), e_pos.x, e_pos.y));
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

        // die aeltesten fossilien entfernen
        //console.log(fossils.length);
        //var f_c=0
        while (fossils.length>0){
            // alter des ersten fossils
            var c_fossil = fossils[0];
            var c_fossil_age = stepcounter - c_fossil.getCreationTime();
            if (c_fossil_age > settings.FOSSILTIME){
                var f_pos = c_fossil.getPos();
                var t = world.getTerrain(f_pos.x, f_pos.y);
                t.setSlotObject(null);
                fossils.shift();
                //f_c++;
            }else{
                break;
            }
        }
        //console.log(f_c+" entfernt");

        stepcounter++;

        if (eprobots.length == 0){
            initEprobots();
        }
        //if (!(0 in kind_count) && !(1 in kind_count)){
        //    initEprobots();
        //}else if (0 in kind_count && !(1 in kind_count)){
        //    initEprobots(1);
        //}else if (1 in kind_count && !(0 in kind_count)){
        //    initEprobots(0);
        //}

        var t_end = new Date().getTime();
        var frame_time = t_end-t_start;
        if (frame_time>t_max) t_max = frame_time;
        t_count = t_count + frame_time;
        var mean = t_count/stepcounter;
        mean = mean.toFixed(1);
        console.log("step: "+stepcounter+" time: "+frame_time+" mean: "+mean+" max: "+t_max);
        if (running) setTimeout(simulationStep, settings.SLEEPTIME - frame_time);
    }

    function draw(){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);

        for (var x=0;x<world_width;x++){
            for (var y=0;y<world_height;y++){
                var t = world.getTerrain(x,y);
                if (t.getSlotObject()==null){

                }else{
                    var t_object = t.getSlotObject();
                    if (t_object.getId()==LIFEFORMS.ENERGY){
                        var age = stepcounter - t_object.getCreationTime();
                        var c_green = 256 - age;
                        if (c_green<100) c_green=100;
                        context2D.fillStyle = "rgb(0, "+c_green+", 0)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }else if (t_object.getId()==LIFEFORMS.EPROBOT){
                        var c_fac = Math.round(tools_map_range(t_object.getAge(), 0, settings.LIFETIME, 255, 0));
                        context2D.fillStyle = "rgb("+c_fac+", 0, 0)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }else if (t_object.getId()==LIFEFORMS.FOSSIL){
                        var age = stepcounter - t_object.getCreationTime();
                        var c_fac = Math.round(tools_map_range(age, 0, settings.FOSSILTIME, 360, 0));
                        var l_fac = Math.round(tools_map_range(age, 0, settings.FOSSILTIME, 0, 90));
                        context2D.fillStyle = "hsl("+c_fac+", 100%, "+l_fac+"%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }
                }
            }
        }
    }

    function initEprobots(kind){
        var currentdate = new Date();
        console.log("init eprobots: " + currentdate + " (kind: " + kind + ")");
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
                for (var i = 0; i < GLOBAL_SETTINGS.PROGRAM_LENGTH; i++) {
                    var val = tools_random(300)-30;
                    program.push(val);
                }

                if (kind == undefined){
                    kind = tools_random(2);
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
    var kind_count = {};
    var fossils = [];

    var sim = this;
}