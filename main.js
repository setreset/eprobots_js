var simulation = null;

$(document).ready(function() {
    console.log("ready");

    // build up simulation setting controls
    for (var key in INITIAL_SIMULATION_SETTINGS) {
        //console.log(key + " " + INITIAL_SIMULATION_SETTINGS[key]);

        //hole template
        var tpl_str = $("#tpl_simulation_setting_control").html();

        // manipulation
        var labeltext = key.toLowerCase().capitalize() + " (Default: " + INITIAL_SIMULATION_SETTINGS[key] + "):";
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
            $("#btn_load").removeAttr("disabled");
            $("#btn_save").removeAttr("disabled");

            $("#btn_start").text("Start");
        }else{
            simulation.startSimulation();
            $("#btn_reset").attr("disabled", "disabled");
            $("#btn_load").attr("disabled", "disabled");
            $("#btn_save").attr("disabled", "disabled");

            $("#btn_start").text("Stop");
        }
    }

    function getDimensions(){
        var new_dimensions_arr = $("#input_dimensions").val().split("x");
        var new_width = parseInt(new_dimensions_arr[0]);
        var new_height = parseInt(new_dimensions_arr[1]);
        if (isNaN(new_width) || isNaN((new_height))){
            new_width = INITIAL_WORLD_WIDTH;
            new_height = INITIAL_WORLD_HEIGHT;
        }
        return [new_width, new_height];
    }

    simulation_canvas.addEventListener("click", toggleRun);

    document.addEventListener('fullscreenchange', on_fullscreen_change);
    document.addEventListener('mozfullscreenchange', on_fullscreen_change);
    document.addEventListener('webkitfullscreenchange', on_fullscreen_change);

    function on_fullscreen_change() {
        console.log("fullscreen change");
        simulation.resizeCanvas();
    }

    simulation = new Simulation(simulation_canvas, INITIAL_SIMULATION_SETTINGS, INITIAL_WORLD_WIDTH, INITIAL_WORLD_HEIGHT);
    simulation.init();

    $("#btn_start").on("click", toggleRun);

    $("#btn_reset").on("click", function(e){
        if (!simulation.getRunning()){
            var old_settings = simulation.getSettings();
            var dimensions = getDimensions();

            simulation = new Simulation(simulation_canvas, old_settings, dimensions[0], dimensions[1]);
            simulation.init();

            $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());
        }
    });

    $("#btn_fullscreen").on("click", toggleFullscreen);

    $("#btn_load").on("click", function(e){
        var simsavestate = $("#simsavestate").val();
        var simsavestateobj = JSON.parse(simsavestate);

        // neue simulation initialisieren
        var sim_width = simsavestateobj.settings.INITIAL_WORLD_WIDTH;
        var sim_height = simsavestateobj.settings.INITIAL_WORLD_HEIGHT;
        var simsettings = simsavestateobj.settings.simsettings;

        simulation = new Simulation(simulation_canvas, simsettings, sim_width, sim_height);
        simulation.loadState(simsavestateobj);

        $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());
        init_simulation_settings();
    });

    $("#btn_save").on("click", function(e){
        var simsavestate = JSON.stringify(simulation);
        //var simsavestate = JSON.stringify(simulation, null, '  ');
        $("#simsavestate").val(simsavestate);
    });

    $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());

    var init_global_settings = function(){
        $("#input_sleeptime").val(GLOBAL_SETTINGS.SLEEPTIME);
    }

    var init_simulation_settings = function(){
        $("#input_dimensions").val(simulation.getWorldWidth() + "x" + simulation.getWorldHeight());

        for (var key in simulation.getSettings()) {
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
        var val_str = input.val();
        var settingtype = typeof INITIAL_SIMULATION_SETTINGS[setting_key.toUpperCase()];

        if (settingtype == "number"){
            console.log("number");
            var int_val = parseInt(val_str);
            console.log(int_val);
            if (!isNaN(int_val)){
                simulation.setSettingVal(setting_key.toUpperCase(), int_val);
            }
        }else if (settingtype == "boolean"){
            console.log("boolean");
            if (val_str == "true"){
                simulation.setSettingVal(setting_key.toUpperCase(), true);
            }else if (val_str == "false"){
                simulation.setSettingVal(setting_key.toUpperCase(), false);
            }
        }else if (settingtype == "string"){
            console.log("string");
            simulation.setSettingVal(setting_key.toUpperCase(), val_str);
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

    //$("#btn_resetsettings").on("click", function(e){
    //    simulation.setSettings(INITIAL_SIMULATION_SETTINGS);
    //    init_simulation_settings();
    //});
});