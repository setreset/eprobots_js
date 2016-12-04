var simulation = null;

$(document).ready(function() {
    console.log("ready");

    // build up simulation setting controls
    for (var key in INITIAL_SIMULATION_SETTINGS) {
        //console.log(key + " " + INITIAL_SIMULATION_SETTINGS[key]);
    }

    var simulation_canvas = document.getElementById('canvas');

    function toggleFullscreen() {
        var elem = document.getElementById('canvas');
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    function toggleRun() {
        if (simulation.getRunning()){
            simulation.stopSimulation();
            $("#btn_reset").removeAttr("disabled");
            $("#btn_start").text("Start");
        }else{
            simulation.startSimulation();
            $("#btn_reset").attr("disabled", "disabled");
            $("#btn_start").text("Stop");
        }
    }

    simulation_canvas.addEventListener("click", toggleRun);

    function on_fullscreen_change() {
        simulation.resizeCanvas();
    }

    document.addEventListener('fullscreenchange', on_fullscreen_change);
    document.addEventListener('mozfullscreenchange', on_fullscreen_change);
    document.addEventListener('webkitfullscreenchange', on_fullscreen_change);

    simulation = new Simulation(simulation_canvas, INITIAL_SIMULATION_SETTINGS, INITIAL_WORLD_WIDTH, INITIAL_WORLD_HEIGHT);
    var last_world_width = INITIAL_WORLD_WIDTH;
    var last_world_height = INITIAL_WORLD_HEIGHT;

    $("#btn_start").on("click", toggleRun);

    $("#btn_reset").on("click", function(e){
        if (!simulation.getRunning()){
            var new_dimensions_string = prompt("Insert new world dimensions",last_world_width + "x" + last_world_height);
            if (new_dimensions_string != null){
                simulation.getContext2D().clearRect(0, 0, simulation_canvas.width, simulation_canvas.height);
                var new_dimensions_arr = new_dimensions_string.split("x");
                var new_width = parseInt(new_dimensions_arr[0]);
                var new_height = parseInt(new_dimensions_arr[1]);
                if (isNaN(new_width) || isNaN((new_height))){
                    new_width = last_world_width;
                    new_height = last_world_height;
                }

                simulation = new Simulation(simulation_canvas, simulation.getSettings(), new_width, new_height);
                last_world_width = new_width;
                last_world_height = new_height;
                $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());
            }
        }
    });

    $("#btn_fullscreen").on("click", toggleFullscreen);

    $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());

    var init_global_settings = function(){
        $("#input_sleeptime").val(GLOBAL_SETTINGS.SLEEPTIME);
    }

    var init_simulation_settings = function(){
        $("#input_lifetime").val(simulation.getSettings().LIFETIME);
        $("#input_fossiltime").val(simulation.getSettings().FOSSILTIME);
        $("#input_object_count").val(simulation.getSettings().OBJECT_COUNT);
    }

    // LIFETIME
    var min_val_lifetime = 1;
    var max_val_lifetime = 750;

    $("#btn_lifetime").on("click", function(e){
        var int_val = parseInt($("#input_lifetime").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_lifetime && int_val<=max_val_lifetime){
                simulation.setSettingsLifetime(int_val);
            }
        }
    });

    // FOSSILTIME
    var min_val_fossiltime = 0;
    var max_val_fossiltime = 5000;

    $("#btn_fossiltime").on("click", function(e){
        var int_val = parseInt($("#input_fossiltime").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_fossiltime && int_val<=max_val_fossiltime){
                simulation.setSettingsFossiltime(int_val);
            }
        }
    });

    // OBJECT_COUNT
    var min_val_object_count = 50;
    var max_val_object_count = 100000;

    $("#btn_object_count").on("click", function(e){
        var int_val = parseInt($("#input_object_count").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_object_count && int_val<=max_val_object_count){
                simulation.setSettingsObjectCount(int_val);
            }
        }
    });

    // SLEEP TIME
    var min_val_sleeptime = 0;
    var max_val_sleeptime = 1000;

    $("#btn_sleeptime").on("click", function(e){
        var int_val = parseInt($("#input_sleeptime").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_sleeptime && int_val<=max_val_sleeptime){
                GLOBAL_SETTINGS.SLEEPTIME = int_val;
            }
        }
    });

    // END INITIAL SETTINGS

    init_global_settings();
    init_simulation_settings();

    $("#btn_resetsettings").on("click", function(e){
        simulation.setSettings(INITIAL_SIMULATION_SETTINGS);
        init_simulation_settings();
    });
});