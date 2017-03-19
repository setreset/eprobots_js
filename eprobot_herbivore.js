function Herbivore(s, x_pos, y_pos, init_programm) {
    // Call the parent constructor, making sure (using Function#call)
    // that "this" is set correctly during the call
    Eprobot.call(this, s, x_pos, y_pos, init_programm);

    // Initialize our Student-specific properties
    //this.subject = subject;
    this.setEnergy(s.getSettings().CHILDHOOD);
}

// Erstellt ein Student.prototype Objekt das von Person.prototype erbt.
// Hinweis: Ein häufiger Fehler ist der Einsatz von "new Person()" beim erstellen vomeines
// Student.prototype. Das ist falsch aus einigen Gründen, nicht nur
// das wir keinen Parameter der Person für "firstName" mitgeben können.
// Der korrekte Ort für den Aufruf von Person ist oben, wo wir es
// von Student aufrufen.
Herbivore.prototype = Object.create(Eprobot.prototype); // See note below

// Setzt die "constructor" Eigenschaft um auf Student zu referenzieren.
Herbivore.prototype.constructor = Herbivore;

Herbivore.prototype.canMoveToField = function(obj_on_candidate_field){
    return obj_on_candidate_field == null || obj_on_candidate_field.getId() == OBJECTTYPES.FOOD;
};

Herbivore.prototype.getId = function(){
    return OBJECTTYPES.EPROBOT_H;
};

Herbivore.prototype.isAlive = function(){
    return this.getAge() < this.s.getSettings().LIFETIME_MIN || (this.getAge() < this.s.getSettings().LIFETIME_MAX && (this.getEnergy() > 0));
};

Herbivore.prototype.preMove = function(obj_on_candidate_field){
    if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == OBJECTTYPES.FOOD) {
        // "eat energy"
        this.s.getWorld().decr_foodcount();
        // neuer eprobot...
        this.addEnergy(this.s.getSettings().FOOD_ENERGY);
    }
};

Herbivore.prototype.kill = function(){
    //console.log("Herbivore kill");
    this.setAge(this.s.getSettings().LIFETIME_MAX);
};

Herbivore.prototype.getForkCondition = function(){
    return this.s.getEprobots_h().length < this.s.getSettings().EPROBOTS_MAX;
};

Herbivore.prototype.fork = function(){
    // freie stelle suchen
    var point = this.s.getWorld().getFreeSpace(this.x_pos, this.y_pos);
    // nachwuchs erzeugen und an freie stelle setzen
    if (point != null){
        // sexuelle fortpflanzung?
        if (Math.random()<0.5 && false){
            //var partner = this.get_local_partner(kind);
            //
            //if (partner){
            //    //console.log("recombine");
            //    var new_dna = tools_recombine(init_programm, partner.getInitialProgram());
            //}else{
            //    //console.log("recombine fail");
            //    var new_dna = tools_mutate(s.getSettingVal("MUTATE_POSSIBILITY"),s.getSettingVal("MUTATE_STRENGTH"), init_programm);
            //}
        }else{
            var new_dna = tools_mutate(this.s.getSettingVal("MUTATE_POSSIBILITY"),this.s.getSettingVal("MUTATE_STRENGTH"),this.getInitialProgram())
        }

        //console.log("Herbivore fork");
        var forked_ep = new Herbivore(this.s, point.x, point.y, new_dna);
        this.addEnergy(-this.s.getSettings().ENERGYCOST_FORK);
        // nachwuchs anmelden
        return forked_ep;
    }else{
        return null;
    }
};

Herbivore.prototype.doAge = function(){
    this.incrAge();

    if (this.getAge() < this.s.getSettings().CHILDHOOD){
        this.addEnergy(-1);
    }else{
        if (this.getAge() > this.s.getSettings().LIFETIME_MIN){
            this.addEnergy(-1);
        }
    }
};