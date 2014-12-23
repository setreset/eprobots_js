var simulation = null;

$(document).ready(function() {
    console.log("ready");
    var canvas = document.getElementById('canvas');
    var context2D = canvas.getContext('2d');

    simulation = new Simulation(context2D);

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
            simulation = new Simulation(context2D);
        }
    });

    $("#slider_lifetime_label span").text(SETTINGS.LIFETIME);
    $("#input_lifetime").val(SETTINGS.LIFETIME);

    var min_val_lifetime = 1;
    var max_val_lifetime = 500;
    $("#slider_lifetime").slider({
        value: SETTINGS.LIFETIME,
        min: min_val_lifetime,
        max: max_val_lifetime,
        slide: function( event, ui ) {
            var val = ui.value;
            $("#slider_lifetime_label span").text(val);
            $("#input_lifetime").val(val);
            SETTINGS.LIFETIME = val;
        }
    });

    $("#btn_lifetime").on("click", function(e){
        var int_val = parseInt($("#input_lifetime").val());
        if (!isNaN(int_val)){
            if (int_val>=min_val_lifetime && int_val<=max_val_lifetime){
                SETTINGS.LIFETIME = int_val;
                $("#slider_lifetime_label span").text(int_val);
                $("#slider_lifetime").slider("value", int_val);
            }
        }
    });
});