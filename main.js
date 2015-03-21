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
        $("#slider_lifetime_label span").text(simulation.getSettings().LIFETIME);
        $("#input_lifetime").val(simulation.getSettings().LIFETIME);
        // beim start wird der slider schon initialisiert, aber bei resetSettings ist das wichtig...
        $("#slider_lifetime").slider("value", simulation.getSettings().LIFETIME);

        $("#slider_existtime_label span").text(simulation.getSettings().EXISTTIME);
        $("#input_existtime").val(simulation.getSettings().EXISTTIME);
        // beim start wird der slider schon initialisiert, aber bei resetSettings ist das wichtig...
        $("#slider_existtime").slider("value", simulation.getSettings().EXISTTIME);

        $("#slider_energy_block_time_label span").text(simulation.getSettings().ENERGY_BLOCK_TIME);
        $("#input_energy_block_time").val(simulation.getSettings().ENERGY_BLOCK_TIME);
        // beim start wird der slider schon initialisiert, aber bei resetSettings ist das wichtig...
        $("#slider_energy_block_time").slider("value", simulation.getSettings().ENERGY_BLOCK_TIME);

        $("#slider_object_count_label span").text(simulation.getSettings().OBJECT_COUNT);
        $("#input_object_count").val(simulation.getSettings().OBJECT_COUNT);
        // beim start wird der slider schon initialisiert, aber bei resetSettings ist das wichtig...
        $("#slider_object_count").slider("value", simulation.getSettings().OBJECT_COUNT);

        $("#slider_sleeptime_label span").text(simulation.getSettings().SLEEPTIME);
        $("#input_sleeptime").val(simulation.getSettings().SLEEPTIME);
        // beim start wird der slider schon initialisiert, aber bei resetSettings ist das wichtig...
        $("#slider_sleeptime").slider("value", simulation.getSettings().SLEEPTIME);
    }

    // LIFETIME
    var min_val_lifetime = 1;
    var max_val_lifetime = 300;
    $("#slider_lifetime").slider({
        value: simulation.getSettings().LIFETIME,
        min: min_val_lifetime,
        max: max_val_lifetime,
        slide: function( event, ui ) {
            var val = ui.value;
            $("#slider_lifetime_label span").text(val);
            $("#input_lifetime").val(val);
            simulation.setSettingsLifetime(val);
        }
    });

    $("#btn_lifetime").on("click", function(e){
        var int_val = parseInt($("#input_lifetime").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_lifetime && int_val<=max_val_lifetime){
                simulation.setSettingsLifetime(int_val);
                $("#slider_lifetime_label span").text(int_val);
                $("#slider_lifetime").slider("value", int_val);
            }
        }
    });

    // EXISTTIME
    var min_val_existtime = 1;
    var max_val_existtime = 9999;
    $("#slider_existtime").slider({
        value: simulation.getSettings().EXISTTIME,
        min: min_val_existtime,
        max: max_val_existtime,
        slide: function( event, ui ) {
            var val = ui.value;
            $("#slider_existtime_label span").text(val);
            $("#input_existtime").val(val);
            simulation.setSettingsExisttime(val);
        }
    });

    $("#btn_existtime").on("click", function(e){
        var int_val = parseInt($("#input_existtime").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_existtime && int_val<=max_val_existtime){
                simulation.setSettingsExisttime(int_val);
                $("#slider_existtime_label span").text(int_val);
                $("#slider_existtime").slider("value", int_val);
            }
        }
    });

    // ENERGY_BLOCK_TIME
    var min_val_energy_block_time = 0;
    var max_val_energy_block_time = 300;
    $("#slider_energy_block_time").slider({
        value: simulation.getSettings().ENERGY_BLOCK_TIME,
        min: min_val_energy_block_time,
        max: max_val_energy_block_time,
        slide: function( event, ui ) {
            var val = ui.value;
            $("#slider_energy_block_time_label span").text(val);
            $("#input_energy_block_time").val(val);
            simulation.setSettingsEnergyBlockTime(val);
        }
    });

    $("#btn_energy_block_time").on("click", function(e){
        var int_val = parseInt($("#input_energy_block_time").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_energy_block_time && int_val<=max_val_energy_block_time){
                simulation.setSettingsEnergyBlockTime(int_val);
                $("#slider_energy_block_time_label span").text(int_val);
                $("#slider_energy_block_time").slider("value", int_val);
            }
        }
    });

    // OBJECT_COUNT
    var min_val_object_count = 100;
    var max_val_object_count = 100000;
    $("#slider_object_count").slider({
        value: simulation.getSettings().OBJECT_COUNT,
        min: min_val_object_count,
        max: max_val_object_count,
        slide: function( event, ui ) {
            var val = ui.value;
            $("#slider_object_count_label span").text(val);
            $("#input_object_count").val(val);
            simulation.setSettingsObjectCount(val);
        }
    });

    $("#btn_object_count").on("click", function(e){
        var int_val = parseInt($("#input_object_count").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_object_count && int_val<=max_val_object_count){
                simulation.setSettingsObjectCount(int_val);
                $("#slider_object_count_label span").text(int_val);
                $("#slider_object_count").slider("value", int_val);
            }
        }
    });

    // SLEEP TIME
    var min_val_sleeptime = 0;
    var max_val_sleeptime = 1000;
    $("#slider_sleeptime").slider({
        value: simulation.getSettings().SLEEPTIME,
        min: min_val_sleeptime,
        max: max_val_sleeptime,
        slide: function( event, ui ) {
            var val = ui.value;
            $("#slider_sleeptime_label span").text(val);
            $("#input_sleeptime").val(val);
            simulation.setSettingsSleeptime(val);
        }
    });

    $("#btn_sleeptime").on("click", function(e){
        var int_val = parseInt($("#input_sleeptime").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_sleeptime && int_val<=max_val_sleeptime){
                simulation.setSettingsSleeptime(int_val);
                $("#slider_sleeptime_label span").text(int_val);
                $("#slider_sleeptime").slider("value", int_val);
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