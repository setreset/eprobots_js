var simulation = null;

$(document).ready(function() {
    console.log("ready");

    // build up simulation setting controls
    for (var key in INITIAL_SIMULATION_SETTINGS) {
        //console.log(key + " " + INITIAL_SIMULATION_SETTINGS[key]);

        //hole template
        var tpl_str = $("#tpl_simulation_setting_control").html();

        // manipulation
        var labeltext = key.toLowerCase().capitalize() + ":";
        tpl_str = tpl_str.replaceAll("TLP-SETTING-LABEL", labeltext);
        tpl_str = tpl_str.replaceAll("TLP-SETTING-ID", key.toLowerCase());

        // insert
        $("#container_simulationsettings_control").append(tpl_str)
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
        for (var key in INITIAL_SIMULATION_SETTINGS) {
            var identifier = "#input_"+ key.toLowerCase();
            $(identifier).val(simulation.getSettingVal(key));
        }
    }

    // SIMULATION SETTINGS SET BUTTON LISTENER

    $("#container_simulationsettings_control").on("click", "button", function(e){
        var elem = $(this);
        var setting_key = elem.attr("data-settingkey");
        console.log(setting_key);
        var input = elem.parent().parent().find("input");

        // konvertierung in den richtigen typ
        var int_val = parseInt(input.val());
        console.log(int_val);
        if (!isNaN(int_val)){
            simulation.setSettingVal(setting_key.toUpperCase(), int_val);
        }
    });

    // GLOBAL SETTINGS

    // SLEEP TIME

    $("#btn_sleeptime").on("click", function(e){
        var int_val = parseInt($("#input_sleeptime").val());
        if (!isNaN(int_val)){
            GLOBAL_SETTINGS.SLEEPTIME = int_val;
        }
    });

    // GLOBAL SETTINGS END

    init_global_settings();
    init_simulation_settings();

    $("#btn_resetsettings").on("click", function(e){
        simulation.setSettings(INITIAL_SIMULATION_SETTINGS);
        init_simulation_settings();
    });
});