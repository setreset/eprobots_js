var simulation = null;

$(document).ready(function() {
    console.log("ready");
    var canvas = document.getElementById('canvas');
    var context2D = canvas.getContext('2d');

    simulation = new Simulation(context2D, SETTINGS);

    $("#btn_start").on("click", function(e){
        if (simulation.getRunning()){
            simulation.stopSimulation();
            $("#btn_reset").removeAttr("disabled");
        }else{
            simulation.startSimulation();
            $("#btn_reset").attr("disabled", "disabled");
        }
    });

    $("#btn_reset").on("click", function(e){
        if (!simulation.getRunning()){
            context2D.clearRect(0, 0, canvas.width, canvas.height);
            simulation = new Simulation(context2D, SETTINGS);
        }
    });

    // SETTINGS
    var init_controls = function(){
        $("#slider_lifetime_label span").text(simulation.getSettings().LIFETIME);
        $("#input_lifetime").val(simulation.getSettings().LIFETIME);
        // beim start wird der slider schon initialisiert, aber bei resetSettings ist das wichtig...
        $("#slider_lifetime").slider("value", simulation.getSettings().LIFETIME);
    }

    var min_val_lifetime = 1;
    var max_val_lifetime = 500;
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
        simulation.setSettings(SETTINGS);
        init_controls();
    });
});