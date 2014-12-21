function Simulation(){
    var running = false;
    var counter = 0;

    var canvas = document.getElementById('canvas');
    var context2D = canvas.getContext('2d');

    this.startSimulation = function(){
        console.log("start simulation");
        running = true;
        simulationStep();
    }

    this.stopSimulation = function(){
        console.log("stop simulation");
        running = false;
    }

    this.getRunning = function(){
        return running;
    }

    function simulationStep(){
        draw();

        counter++;

        if (running) setTimeout(simulationStep, SETTINGS.SLEEPTIME);
    }

    function draw(){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        context2D.fillText(counter,10,50);
    }
}