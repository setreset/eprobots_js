var simulation = null;

$(document).ready(function() {
    console.log("ready");
    var simulation_canvas = document.getElementById('canvas');

    function fullscreen(){
        if(simulation_canvas.webkitRequestFullScreen) {
            simulation_canvas.webkitRequestFullScreen();
        }
        else {
            simulation_canvas.mozRequestFullScreen();
        }

    }

    simulation_canvas.addEventListener("dblclick", fullscreen);

    function on_fullscreen_change() {
        simulation.resizeCanvas();
        //if(document.mozFullScreen || document.webkitIsFullScreen) {
        //    var rect = c.getBoundingClientRect();
        //    c.width = rect.width;
        //    c.height = rect.height;
        //}
        //else {
        //    c.width = 500;
        //    c.height = 400;
        //}
    }

    document.addEventListener('mozfullscreenchange', on_fullscreen_change);
    document.addEventListener('webkitfullscreenchange', on_fullscreen_change);

    simulation = new Simulation(simulation_canvas, INITIAL_SIMULATION_SETTINGS, INITIAL_WORLD_WIDTH, INITIAL_WORLD_HEIGHT);
    var last_world_width = INITIAL_WORLD_WIDTH;
    var last_world_height = INITIAL_WORLD_HEIGHT;

    $("#btn_start").on("click", function(e){
        if (simulation.getRunning()){
            simulation.stopSimulation();
            $("#btn_reset").removeAttr("disabled");
            $(this).text("Start");
        }else{
            simulation.startSimulation();
            $("#btn_reset").attr("disabled", "disabled");
            $(this).text("Stop");
        }
    });

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

    $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());

    // INITIAL_SIMULATION_SETTINGS
    var init_controls = function(){
        $("#input_lifetime").val(simulation.getSettings().LIFETIME);
        $("#input_fossiltime").val(simulation.getSettings().FOSSILTIME);
        $("#input_energy_block_time").val(simulation.getSettings().ENERGY_BLOCK_TIME);
        $("#input_object_count").val(simulation.getSettings().OBJECT_COUNT);
        $("#input_sleeptime").val(simulation.getSettings().SLEEPTIME);
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
    var min_val_object_count = 100;
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
                simulation.setSettingsSleeptime(int_val);
            }
        }
    });

    // END INITIAL SETTINGS

    init_controls();

    $("#btn_resetsettings").on("click", function(e){
        simulation.setSettings(INITIAL_SIMULATION_SETTINGS);
        init_controls();
    });
});