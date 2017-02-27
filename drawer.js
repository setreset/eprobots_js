function Drawer(s, canvas){

    this.draw = function(change){
        //context2D.fillStyle = "rgb(255, 255, 255)";
        context2D.clearRect(0, 0, canvas.width, canvas.height);

        for (var x=0;x< s.getWorldWidth();x++){
            for (var y=0;y< s.getWorldHeight();y++){
                var t = s.getWorld().getTerrain(x,y);
                var t_object = t.getSlotObject();

                if (t_object != null){
                    if (t_object.getId()==OBJECTTYPES.ENERGY){
                        var age = s.getStepCounter() - t_object.getCreationTime();
                        var c_green = 256 - age;
                        if (c_green<100) c_green=100;
                        context2D.fillStyle = "rgb(0, "+c_green+", 0)";
                        //context2D.fillStyle = "rgb(0, 255, 0)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);

                    }else if (t_object.getId()==OBJECTTYPES.EPROBOT){
                        var c_fac = Math.round(tools_map_range(t_object.getAge(), 0, s.getSettings().LIFETIME_MAX, 255, 100));

                        if (t_object.getKind()==0){
                            context2D.fillStyle = "rgb("+c_fac+", 0, 0)";
                            //context2D.fillStyle = "rgb(255, 0, 0)";
                            context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                        }else if(t_object.getKind()==1){
                            context2D.fillStyle = "rgb(0, 0, "+ c_fac +")";
                            context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                        }


                    }else if (t_object.getId()==OBJECTTYPES.FOSSIL){
                        var fossil_age = s.getStepCounter() - t_object.getCreationTime();
                        var c_fac = Math.round(tools_map_range(fossil_age, 0, s.getSettings().FOSSILTIME, 360, 0));
                        var l_fac = Math.round(tools_map_range(fossil_age, 0, s.getSettings().FOSSILTIME, 0, 90));
                        context2D.fillStyle = "hsl("+c_fac+", 0%, "+l_fac+"%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);

                        if (fossil_age > s.getSettings().FOSSILTIME){
                            //var f_pos = t_object.getPos();
                            //var t = world.getTerrain(f_pos.x, f_pos.y);
                            t.setSlotObject(null);
                        }

                    }
                }else{
                    //var age = stepcounter - t_object.getCreationTime();
                    //var c_green = 256 - age;
                    //if (c_green<100) c_green=100;

                    var trace_val_0 = t.get_trace(0);
                    var trace_val_1 = t.get_trace(1);
                    var fruitfulness = t.getFruitfulness();

                    //if (trace_val_0 > 0 && trace_val_1 == 0) {
                    //    var l_val = Math.round(tools_map_range(trace_val_0, 0, settings.TRACETIME, 90, 60));
                    //    //context2D.fillStyle = "hsl(0, 52%, " + l_val + "%)";
                    //    context2D.fillStyle = "hsl(60, 100%, " + l_val + "%)";
                    //    context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    //}else if (trace_val_1 > 0 && trace_val_0 == 0) {
                    //    var l_val = Math.round(tools_map_range(trace_val_1, 0, settings.TRACETIME, 90, 45));
                    //    context2D.fillStyle = "hsl(194, 52%, " + l_val + "%)";
                    //    context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    //}
                    //else if (trace_val_0 > 0 && trace_val_1 > 0){
                    //    var h0 = 0;
                    //    var s0 = 0.52;
                    //    var l0 = tools_map_range(trace_val_0, 0, 64, 0.9, 0.45);
                    //
                    //    var h1 = 0.54;
                    //    var s1 = 0.52;
                    //    var l1 = tools_map_range(trace_val_1, 0, 64, 0.9, 0.45);
                    //
                    //    var rgb0 = hslToRgb(h0, s0, l0);
                    //    var rgb1 = hslToRgb(h1, s1, l1);
                    //    var rgb_all = merge_colors(rgb0, rgb1);
                    //
                    //    //console.log(rgb_all);
                    //    context2D.fillStyle = "rgb("+rgb_all[0]+", "+rgb_all[1]+", "+rgb_all[2]+")";
                    //    context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    //}


                    if (trace_val_1 > 0) {
                        var l_val = Math.round(tools_map_range(trace_val_1, 0, s.getSettings().TRACETIME, 90, 50));
                        //context2D.fillStyle = "hsl(0, 52%, " + l_val + "%)";
                        context2D.fillStyle = "hsl(177, 100%, " + l_val + "%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }
                    if (trace_val_0 > 0) {
                        var l_val = Math.round(tools_map_range(trace_val_0, 0, s.getSettings().TRACETIME, 90, 60));
                        //context2D.fillStyle = "hsl(0, 52%, " + l_val + "%)";
                        context2D.fillStyle = "hsl(60, 100%, " + l_val + "%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }
                    if(fruitfulness > 0){
                        var l_val = Math.round(tools_map_range(fruitfulness, 0, 1000, 100, 20));
                        //context2D.fillStyle = "hsl(0, 52%, " + l_val + "%)";
                        context2D.fillStyle = "hsl(29, 100%, " + l_val + "%)";
                        context2D.fillRect(x * x_step, y * y_step, x_step, y_step);
                    }

                }


                if (change){
                    t.decr_trace(0);
                    t.decr_trace(1);
                    t.decrFruitfulness();
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