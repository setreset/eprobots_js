function Simulation(){

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

        // processing
        eprobot.newStep();

        stepcounter++;
        if (running) setTimeout(simulationStep, SETTINGS.SLEEPTIME);
    }

    function draw(){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);

        for (var x=0;x<SETTINGS.WORLD_WIDTH;x++){
            for (var y=0;y<SETTINGS.WORLD_HEIGHT;y++){
                var t = world.getTerrain(x,y);
                if (t.getSlot()==null){

                }else{
                    if (t.getSlot()==1){
                        context2D.fillStyle = "rgb(0, 255, 0)";
                    }else if (t.getSlot()==2){
                        context2D.fillStyle = "rgb(255, 0, 0)";
                    }
                    context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                }
            }
        }

    }

    this.getWorld = function(){
        return world;
    }

    // init
    var running = false;
    var stepcounter = 0;

    var canvas = document.getElementById('canvas');
    var context2D = canvas.getContext('2d');

    var x_step = canvas.width / SETTINGS.WORLD_WIDTH;
    var y_step = canvas.height / SETTINGS.WORLD_HEIGHT;

    var world = new World(this);
    var eprobot = new Eprobot(this, 5, 5);
    this.eprobots = [];
    world.setEnergy();
}