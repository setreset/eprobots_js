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

    function simulationStep(){
        t_start = new Date().getTime();

        world.seedEnergy();
        //world.seedEnergy_tile();
        drawer.draw(true);

        if (eprobots[0].length==0){
            beep(2020);
            initEprobots(0);
        }

        processEprobots(0);

        if (eprobots[0].length > 100 && eprobots[1].length==0){
            beep(3020);
            initEprobots(1);
        }

        processEprobots(1);

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

        if (running) setTimeout(simulationStep, GLOBAL_SETTINGS.SLEEPTIME - frame_time);
    }

    function processEprobots(kind){
        var eprobots_next = [];

        var ep = eprobots[kind];

        // processing
        for (var i=0;i<ep.length;i++){
            var eprobot = ep[i];
            // Leben
            if (kind == 0){
                var life_condition = eprobot.getAge() < settings.LIFETIME_MIN || (eprobot.getAge() < settings.LIFETIME_MAX && (eprobot.getEnergy() > 0));
            }else{
                var life_condition = eprobot.getAge() < 300;
            }
            if (life_condition){

                var forked_ep = eprobot.newStep();
                if (forked_ep != null){
                    eprobots_next.push(forked_ep);
                }

                eprobots_next.push(eprobot);
            }
            // Sterben
            else{
                // aus map entfernen
                var e_pos = eprobot.getPos();

                if (settings.FOSSILTIME > 0){
                    new Fossil(sim, eprobot.getKind(), e_pos.x, e_pos.y);
                }else{
                    var t = world.getTerrain(e_pos.x, e_pos.y);
                    t.setSlotObject(null);
                }
            }
        }

        eprobots[kind] = eprobots_next;
    }

    function initEprobots(kind){
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
                for (var i = 0; i < settings.PROGRAM_LENGTH; i++) {
                    var val = tools_random(settings.PROGRAM_LENGTH*10) - settings.PROGRAM_LENGTH;
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

        //eprobots = [[]];
        eprobots = [[],[]];

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
            eprobots: eprobots,
            world: world
        };
    };

    this.loadState = function(simstate){
        stepcounter = simstate.stepcounter;
        world = new World(this);
        world.loadState(simstate.world);

        eprobots = [[]];

        for (var i = 0; i< simstate.eprobots[0].length; i++){
            var e_state = simstate.eprobots[0][i];
            var e = new Eprobot(sim, 0, e_state.x_pos, e_state.y_pos, e_state.init_programm);
            e.loadState(e_state);
            eprobots[0].push(e);
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
    var eprobots = null;
    var sim = this;

    var drawer = new Drawer(sim, canvas);
}