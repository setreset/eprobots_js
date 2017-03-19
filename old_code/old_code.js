//this.fork = function(){
//    // freie stelle suchen
//    var point = this.s.getWorld().getFreeSpace(this.x_pos, this.y_pos);
//    // nachwuchs erzeugen und an freie stelle setzen
//    if (point != null){
//        // sexuelle fortpflanzung?
//        if (Math.random()<0.5 && false){
//            //var partner = this.get_local_partner(kind);
//            //
//            //if (partner){
//            //    //console.log("recombine");
//            //    var new_dna = tools_recombine(init_programm, partner.getInitialProgram());
//            //}else{
//            //    //console.log("recombine fail");
//            //    var new_dna = tools_mutate(s.getSettingVal("MUTATE_POSSIBILITY"),s.getSettingVal("MUTATE_STRENGTH"), init_programm);
//            //}
//        }else{
//            var new_dna = tools_mutate(this.s.getSettingVal("MUTATE_POSSIBILITY"),this.s.getSettingVal("MUTATE_STRENGTH"),this.getInitialProgram())
//        }
//
//        //console.log("Herbivore fork");
//        var forked_ep = new Herbivore(this.s, point.x, point.y, new_dna);
//        this.addEnergy(-this.s.getSettings().ENERGYCOST_FORK);
//        // nachwuchs anmelden
//        return forked_ep;
//    }else{
//        return null;
//    }
//};