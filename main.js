var simulation = null;

$(document).ready(function() {
    console.log("ready");
    simulation = new Simulation();

    $("#btn_start").on("click", function(e){
        if (simulation.getRunning()){
            simulation.stopSimulation();
        }else{
            simulation.startSimulation();
        }
    });
});