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

    this.getEprobots = function(){
        return eprobots;
    }

    function simulationStep(){
        world.seedEnergy();
        draw();

        var eprobots_next = [];
        // processing
        for (var i=0;i<eprobots.length;i++){
            var eprobot = eprobots[i];
            if (eprobot.getAge() >= SETTINGS.LIFETIME){
                // aus map entfernen
                var e_pos = eprobot.getPos();

                var t = world.getTerrain(e_pos.x, e_pos.y);
                t.setSlotObject(null);
            }else{
                var forked_ep = eprobot.newStep();
                eprobots_next.push(eprobot);
                if (forked_ep != null){
                    eprobots_next.push(forked_ep);
                }
            }
        }

        eprobots = eprobots_next;
        stepcounter++;

        if (running) setTimeout(simulationStep, SETTINGS.SLEEPTIME);
    }

    function draw(){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);

        for (var x=0;x<SETTINGS.WORLD_WIDTH;x++){
            for (var y=0;y<SETTINGS.WORLD_HEIGHT;y++){
                var t = world.getTerrain(x,y);
                if (t.getSlotObject()==null){

                }else{
                    if (t.getSlotObject().getId()==LIFEFORMS.ENERGY){
                        context2D.fillStyle = "rgb(0, 255, 0)";
                    }else if (t.getSlotObject().getId()==LIFEFORMS.EPROBOT){
                        var c_fac = Math.round(255/SETTINGS.LIFETIME)* t.getSlotObject().getAge();
                        context2D.fillStyle = "rgb(255, "+c_fac+", "+c_fac+")";
                    }
                    context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                }
            }
        }

    }

    this.getWorld = function(){
        return world;
    }

    this.getStepCounter = function(){
        return stepcounter;
    }

    // init
    var running = false;
    var stepcounter = 0;

    var canvas = document.getElementById('canvas');
    var context2D = canvas.getContext('2d');

    var x_step = canvas.width / SETTINGS.WORLD_WIDTH;
    var y_step = canvas.height / SETTINGS.WORLD_HEIGHT;

    var world = new World(this);

    var eprobots = [];
    eprobots.push(new Eprobot(this, 5, 5));
    eprobots.push(new Eprobot(this, 10, 10));
    //world.seedEnergy();
}