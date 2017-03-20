function Drawer(s, canvas){

    this.draw = function(change){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);

        for (var x=0;x< s.getWorldWidth();x++){
            for (var y=0;y< s.getWorldHeight();y++){
                var t = s.getWorld().getTerrain(x,y);

                if (change){
                    t.decr_trace(0);
                    t.decr_trace(1);
                    t.decrFruitfulness();
                    t.decrObstacle();
                }

                var t_object = t.getSlotObject();

                if (t_object != null){
                    if (t_object.getId()==OBJECTTYPES.FOOD){
                        var age = s.getStepCounter() - t_object.getCreationTime();
                        var c_green = 256 - age;
                        if (c_green<100) c_green=100;
                        context2D.fillStyle = "rgb(0, "+c_green+", 0)";
                        //context2D.fillStyle = "rgb(0, 255, 0)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);

                    }else if (t_object.getId()==OBJECTTYPES.EPROBOT_H){
                        var c_fac = Math.round(tools_map_range(t_object.getAge(), 0, s.getSettings().LIFETIME_MAX, 255, 100));

                        context2D.fillStyle = "rgb("+c_fac+", 0, 0)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }else if (t_object.getId()==OBJECTTYPES.EPROBOT_C){
                        var c_fac = Math.round(tools_map_range(t_object.getAge(), 0, s.getSettings().LIFETIME_MAX_C, 255, 100));

                        context2D.fillStyle = "rgb(0, 0, "+ c_fac +")";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }
                }else{

                    var trace_val_0 = t.get_trace(0);
                    var trace_val_1 = t.get_trace(1);
                    var fruitfulness = t.getFruitfulness();
                    var obstacle_val = t.getObstacle();

                    if (obstacle_val > 0){
                        var obstacle_age = s.getSettings().OBSTACLETIME-obstacle_val; //s.getStepCounter() - t_object.getCreationTime();
                        var c_fac = Math.round(tools_map_range(obstacle_age, 0, s.getSettings().OBSTACLETIME, 360, 0));
                        var l_fac = Math.round(tools_map_range(obstacle_age, 0, s.getSettings().OBSTACLETIME, 0, 90));

                        context2D.fillStyle = "hsl("+c_fac+", 0%, "+l_fac+"%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }else{
                        if(fruitfulness > 0){
                            var l_val = Math.round(tools_map_range(fruitfulness, 0, 1000, 100, 20));
                            //context2D.fillStyle = "hsl(0, 52%, " + l_val + "%)";
                            context2D.fillStyle = "hsl(29, 100%, " + l_val + "%)";
                            context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                        }else{
                            if (trace_val_0 > 0) {
                                var l_val = Math.round(tools_map_range(trace_val_0, 0, s.getSettings().TRACETIME, 90, 60));
                                //context2D.fillStyle = "hsl(0, 52%, " + l_val + "%)";
                                context2D.fillStyle = "hsl(60, 100%, " + l_val + "%)";
                                context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                            }else{
                                if (trace_val_1 > 0) {
                                    var l_val = Math.round(tools_map_range(trace_val_1, 0, s.getSettings().TRACETIME, 90, 50));
                                    //context2D.fillStyle = "hsl(0, 52%, " + l_val + "%)";
                                    context2D.fillStyle = "hsl(177, 100%, " + l_val + "%)";
                                    context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    this.resizeCanvas = function(){
        console.log("resizeCanvas");
        var rect = canvas.getBoundingClientRect();
        var c_w = rect.width;
        var c_h = rect.height;

        canvas.width = c_w; //$(simulation_canvas).width();
        canvas.height = c_h; //$(simulation_canvas).height();
        x_step = c_w / s.getWorldWidth();
        y_step = c_h / s.getWorldHeight();
    }

    // init
    var context2D = canvas.getContext('2d');
    var x_step, y_step;
    this.resizeCanvas();
}