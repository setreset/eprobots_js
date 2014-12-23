var simulation = null;

$(document).ready(function() {
    console.log("ready");
    var canvas = document.getElementById('canvas');
    var context2D = canvas.getContext('2d');

    simulation = new Simulation(context2D, INITIAL_SIM_SETTINGS, INITIAL_WORLD_WIDTH, INITIAL_WORLD_HEIGHT);
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
                context2D.clearRect(0, 0, canvas.width, canvas.height);
                var new_dimensions_arr = new_dimensions_string.split("x");
                var new_width = parseInt(new_dimensions_arr[0]);
                var new_height = parseInt(new_dimensions_arr[1]);
                if (isNaN(new_width) || isNaN((new_height))){
                    new_width = last_world_width;
                    new_height = last_world_height;
                }

                simulation = new Simulation(context2D, INITIAL_SIM_SETTINGS, new_width, new_height);
                last_world_width = new_width;
                last_world_height = new_height;
                $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());
            }
        }
    });

    $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());

    // INITIAL_SIM_SETTINGS
    var init_controls = function(){
        $("#slider_lifetime_label span").text(simulation.getSettings().LIFETIME);
        $("#input_lifetime").val(simulation.getSettings().LIFETIME);
        // beim start wird der slider schon initialisiert, aber bei resetSettings ist das wichtig...
        $("#slider_lifetime").slider("value", simulation.getSettings().LIFETIME);

        $("#slider_energy_block_time_label span").text(simulation.getSettings().ENERGY_BLOCK_TIME);
        $("#input_energy_block_time").val(simulation.getSettings().ENERGY_BLOCK_TIME);
        // beim start wird der slider schon initialisiert, aber bei resetSettings ist das wichtig...
        $("#slider_energy_block_time").slider("value", simulation.getSettings().ENERGY_BLOCK_TIME);
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

    // END INITIAL SETTINGS

    init_controls();

    $("#btn_resetsettings").on("click", function(e){
        simulation.setSettings(INITIAL_SIM_SETTINGS);
        init_controls();
    });
});