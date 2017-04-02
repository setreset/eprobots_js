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

    this.getEprobots_h = function(){
        return eprobots_h;
    }

    this.getEprobots_c = function(){
        return eprobots_c;
    }

    this.getWorldWidth = function(){
        return world_width;
    }

    this.getWorldHeight = function(){
        return world_height;
    }

    function simulationStep(){
        t_start = new Date().getTime();

        world.seedEnergy();
        //world.seedEnergy_tile();

        if (eprobots_h.length==0){
            beep(2020);
            initEprobots(OBJECTTYPES.EPROBOT_H);
        }

        if (eprobots_h.length > 100 && eprobots_c.length==0){
            beep(3020);
            initEprobots(OBJECTTYPES.EPROBOT_C);
        }

        eprobots_h = processEprobots(eprobots_h);
        eprobots_c = processEprobots(eprobots_c);

        stepcounter++;

        var t_end = new Date().getTime();
        var frame_time = t_end-t_start;

        if (GLOBAL_SETTINGS.LOG_STATS){
            if (frame_time>t_max) t_max = frame_time;
            t_count = t_count + frame_time;
            var mean = t_count/stepcounter;
            mean = mean.toFixed(1);
            console.log("step: "+stepcounter+" time: "+frame_time+" mean: "+mean+" max: "+t_max);
        }

        drawer.draw(true);

        if (running) setTimeout(simulationStep, GLOBAL_SETTINGS.SLEEPTIME - frame_time);
    }

    function processEprobots(ep){
        var eprobots_next = [];

        // processing
        for (var i=0;i<ep.length;i++){
            var eprobot = ep[i];
            // Leben
            if (eprobot.isAlive()){

                var forked_ep = eprobot.newStep();
                if (forked_ep != null){
                    eprobots_next.push(forked_ep);
                }

                eprobot.doAge();
                eprobots_next.push(eprobot);
            }
            // Sterben
            else{
                // aus map entfernen
                var e_pos = eprobot.getPos();

                var t = world.getTerrain(e_pos.x, e_pos.y);
                t.setSlotObject(null);

                if (settings.FOSSILTIME > 0){
                    t.setObstacle(settings.FOSSILTIME);
                }
            }
        }

        return eprobots_next;
    }

    function initEprobots(kind){
        var currentdate = new Date();
        console.log("init eprobots (" + kind + "): " + currentdate);
        var program;


        for (var loop=0;loop<50;loop++){
            var x_pos, y_pos;
            x_pos = tools_random(world_width);
            y_pos = tools_random(world_height);

            var t_new = world.getTerrain(x_pos,y_pos);
            var obj_on_candidate_field = t_new.getSlotObject();

            // ist da auch nichts?
            if (obj_on_candidate_field == null) {
                //console.log(x_pos, y_pos)

                program = [];
                for (var i = 0; i < settings.PROGRAM_LENGTH; i++) {
                    var val = tools_random(settings.PROGRAM_LENGTH*10) - settings.PROGRAM_LENGTH;
                    program.push(val);
                }

                if (kind == OBJECTTYPES.EPROBOT_H){
                    var newep = new Herbivore(sim, x_pos, y_pos, program);
                    eprobots_h.push(newep);
                }else if(kind == OBJECTTYPES.EPROBOT_C){
                    var newep = new Carnivore(sim, x_pos, y_pos, program);
                    eprobots_c.push(newep);
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

    this.getSettingVal = function(setting_id){
        return settings[setting_id];
    }

    this.setSettings = function(val){
        settings = $.extend({}, val);
    }

    this.setSettingVal = function(setting_id, val){
        settings[setting_id] = val;
    };

    this.init = function(){
        world = new World(this);
        world.init();

        eprobots_h = [];
        eprobots_c = [];

        drawer.draw(false);
    }

    this.toJSON = function() {
        return {
            stepcounter: stepcounter,
            settings: {
                INITIAL_WORLD_WIDTH: initial_world_width,
                INITIAL_WORLD_HEIGHT: initial_world_height,
                simsettings: settings
            },
            eprobots_h: eprobots_h,
            eprobots_c: eprobots_c,
            world: world
        };
    };

    this.loadState = function(simstate){
        stepcounter = simstate.stepcounter;
        world = new World(this);
        world.loadState(simstate.world);

        eprobots_h = [];
        eprobots_c = [];

        for (var i = 0; i< simstate.eprobots_h.length; i++){
            var e_state = simstate.eprobots_h[i];
            var e = new Herbivore(sim, e_state.x_pos, e_state.y_pos, e_state.init_programm);
            e.loadState(e_state);
            eprobots_h.push(e);
        }

        for (var i = 0; i< simstate.eprobots_c.length; i++){
            var e_state = simstate.eprobots_c[i];
            var e = new Carnivore(sim, e_state.x_pos, e_state.y_pos, e_state.init_programm);
            e.loadState(e_state);
            eprobots_c.push(e);
        }

        drawer.draw(false);
    }

    this.getDrawer = function(){
        return drawer;
    }

    // init
    var world_width = initial_world_width;
    var world_height = initial_world_height;
    var settings = null;
    this.setSettings(initial_settings);

    var t_start = null;
    var t_max = 0;
    var t_count = 0;

    var running = false;
    var stepcounter = 0;

    var world = null;
    var drawer = new Drawer(this, canvas);
    var eprobots_h = null;
    var eprobots_c = null;
    var sim = this;
}