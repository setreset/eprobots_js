function Carnivore(s, x_pos, y_pos, init_programm) {
    // Call the parent constructor, making sure (using Function#call)
    // that "this" is set correctly during the call
    Eprobot.call(this, s, x_pos, y_pos, init_programm);

    // Initialize our Student-specific properties
    //this.subject = subject;
};

// Erstellt ein Student.prototype Objekt das von Person.prototype erbt.
// Hinweis: Ein häufiger Fehler ist der Einsatz von "new Person()" beim erstellen vomeines
// Student.prototype. Das ist falsch aus einigen Gründen, nicht nur
// das wir keinen Parameter der Person für "firstName" mitgeben können.
// Der korrekte Ort für den Aufruf von Person ist oben, wo wir es
// von Student aufrufen.
Carnivore.prototype = Object.create(Eprobot.prototype); // See note below

// Setzt die "constructor" Eigenschaft um auf Student zu referenzieren.
Carnivore.prototype.constructor = Carnivore;

//// Ersetzt die "sayHello" Methode
//Student.prototype.sayHello = function(){
//    console.log("Hello, I'm " + this.firstName + ". I'm studying "
//        + this.subject + ".");
//};
//
//// Fügt die "sayGoodBye" Methode hinzu
//Student.prototype.sayGoodBye = function(){
//    console.log("Goodbye!");
//};

Carnivore.prototype.canMoveToField = function(obj_on_candidate_field){
    return obj_on_candidate_field == null || (obj_on_candidate_field.getId() == OBJECTTYPES.EPROBOT_H);
}

Carnivore.prototype.getId = function(){
    return OBJECTTYPES.EPROBOT_C;
}

Carnivore.prototype.isAlive = function(){
    return this.getAge() < 300;
}

Carnivore.prototype.preMove = function(obj_on_candidate_field){
    if (obj_on_candidate_field != null && obj_on_candidate_field.getId() == OBJECTTYPES.EPROBOT_H) {
        // "eat"
        obj_on_candidate_field.kill();
        // neuer eprobot...
        this.addEnergy(this.s.getSettings().FOOD_ENERGY);
    }
}

Carnivore.prototype.getForkCondition = function(){
    return this.s.getEprobots(1).length < this.s.getEprobots(0).length;
}

Carnivore.prototype.fork = function(){
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

        //console.log("Carnivore fork");
        var forked_ep = new Carnivore(this.s, point.x, point.y, new_dna);
        this.addEnergy(-this.s.getSettings().ENERGYCOST_FORK);
        // nachwuchs anmelden
        return forked_ep;
    }else{
        return null;
    }
}