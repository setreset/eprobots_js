var simulation = null;

$(document).ready(function() {
    console.log("ready");
    var canvas = document.getElementById('canvas');
    var context2D = canvas.getContext('2d');

    simulation = new Simulation(context2D, INITIAL_SETTINGS, INITIAL_WORLD_WIDTH, INITIAL_WORLD_HEIGHT);
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

                simulation = new Simulation(context2D, INITIAL_SETTINGS, new_width, new_height);
                last_world_width = new_width;
                last_world_height = new_height;
                $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());
            }
        }
    });

    // INITIAL_SETTINGS
    var init_controls = function(){
        $("#slider_lifetime_label span").text(simulation.getSettings().LIFETIME);
        $("#input_lifetime").val(simulation.getSettings().LIFETIME);
        // beim start wird der slider schon initialisiert, aber bei resetSettings ist das wichtig...
        $("#slider_lifetime").slider("value", simulation.getSettings().LIFETIME);
    }

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

    init_controls();
    $("#dimensions_label span").text(simulation.getWorldWidth()+" x "+simulation.getWorldHeight());

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

    $("#btn_resetsettings").on("click", function(e){
        simulation.setSettings(INITIAL_SETTINGS);
        init_controls();
    });
});