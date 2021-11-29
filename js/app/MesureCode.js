'use strict';
/**
 * class MesureCode
 * -----------------
 * Pour les input-text qui contiennent chaque mesure de code.
 * 
 * Principe :
 *  - une mesure-code contient toujours ses deux lignes
 * 
 */

class MesureCode {

/**
 * @return {String} Le code complet
 * 
 */
static getFullCode(params){
  var c = []
  for(var xportee = 0; xportee < Score.stavesCount; ++xportee){
    c.push([])
    for(var imesure = params.from - 1; imesure < params.to; ++ imesure){
      const mes = this.table_mesures[imesure]
      if (!mes) break ; // Numéro de dernière mesure trop grand
      var code = mes.getPorteeCode(parseInt(xportee,10) + 1).trim()
      if ( code == '' ) return ;
      c[xportee].push(code)
    }
    c[xportee] = c[xportee].join(' | ')
  }
  return c.join("\n")
}

/**
 * Méthode qui "parse" le code +code+
 * Parser signifie : le décomposer en systèmes (autant que de lignes)
 * et le découper en mesure, pour reconstruire l'affichage et pouvoir
 * le modifier.
 * 
 * Cette méthode est appelée par la méthode App.traiteCodeInitial()
 * qui parse un code complet donné par les outils pour reproduire un
 * code complet.
 * 
 */
static parse(code){
  this.reset()
  console.log("Je dois parser le code :", code)
  const porteesCode = code.split("\n")
  const nombrePortees = porteesCode.length
  Score.systemeValue = nombrePortees
  for(var iportee = 0, lenP = porteesCode.length; iportee < lenP; ++ iportee){
    var mesuresCode = porteesCode[iportee];
    // console.log("Étude de la mesuresCode : ", mesuresCode)
    mesuresCode = mesuresCode.split(' | ')
    // console.log("Mesures de code : ", mesuresCode)
    for(var imesure = 1, len = mesuresCode.length; imesure <= len; ++imesure){
      let mesure;
      if ( iportee == 0 ) {
        // 
        // Si c'est la première portée de la mesure-code, on
        // crée une nouvelle mesure-code. Cela crée toutes les 
        // portée superposée de la mesure courante.
        // 
        mesure = this.createNew()
      } else {
        mesure = this.table_mesures[imesure - 1]
        mesure || console.error("Impossible d'obtenir la mesure-code ")
      }
      // 
      // Dans tous les cas, on définit le code
      // de la portée x
      //
      var c = mesuresCode[imesure - 1].trim()
      // console.log("Code mesure = ", c)
      mesure.setPorteeCode(1 + iportee, c)
    }
  }
}

/**
 * Méthode "tournant" la méthode +method+ sur chaque mesure-code
 * 
 * Rappel : une "mesure-code", c'est un ensemble de portées par 
 * système
 * 
 * #exemple
 *    MesureCode.each(mes => console.log(mes.code))
 * 
 */
static each(method){
  if ( this.count == 0 ) return
  this.table_mesures.forEach(mesure => method(mesure))
}

/**
 * Méthode appelée par le bouton "+" pour créer une nouvelle 
 * mesure-code. Ou quand on doit recréer une partition
 */
static createNew(data){
  const mesure = new this(this.getNextId());
  if (data) mesure.data = data
  mesure.build()
  mesure.focus()
  this.add(mesure)
  return mesure
}

/**
 * Pour ajouter la mesure-code +mesure+ à la liste Array des mesures
 *
 */
static add(mesure){
  if (!this.table_mesures) this.table_mesures = []
  this.table_mesures.push(mesure)
}

/**
 * Retourne le nombre de mesures
 * 
 */
static count(){
  if (!this.lastId) this.lastId = 0;
  return this.lastId
}

/**
 * Méthode appelée quand on change le numéro de la première mesure
 * 
 */
static onChangeFirstMesureNumber(ev){
  this.firstMeasureNumber = UI.getFirstNumber()
  this.each(mescode => mescode.updateMeasureNumber())
  return stopEvent(ev)
}

static get firstMeasureNumber(){return this._firstnum || ( this._firstnum = UI.getFirstNumber())}
static set firstMeasureNumber(v){this._firstnum = v}


static getNextId(){
  if (!this.lastId) this.lastId = 0;
  return ++ this.lastId;
}

static removeCurrent(){
  console.info("Je dois apprendre à supprimer la mesure-code courante.")
}

/**
 * Quand on clique sur le bouton pour réinitialiser tout
 * 
 */
static resetAll(){
  this.reset()
  this.createNew()
}

static reset(){
  this.container.innerHTML = ""
  this.table_mesures = []
  this.lastId = 0
}


static get container(){
  return this._container || (this._container = document.querySelector('#mesures_code'))
}

// --- INSTANCE ---

constructor(id, notes){
  this.id     = id
  this.notes  = notes
}

/**
 * Retourne le code de la portée +xportee+ de cette mesure-code
 * 
 */
getPorteeCode(xportee) {
  xportee = xportee || 1
  const val = this.obj.querySelector('.mesure_code.portee'+xportee).value
  // console.info("Code de la portée " + xportee + " du système " + this.id, val)
  return val
}
setPorteeCode(xportee, code){
  // console.log("Je dois mettre la portée " + xportee + " à : ", code)
  this.obj.querySelector('.mesure_code.portee'+xportee).value = code
  this.setWidth()
}

/**
 * Méthode qui permet de définir la taille de la mesure en fonction
 * de son contenu (à chasse fixe)
 * Elle est appelée :
 *  - quand on reprend un code au chargement de la page
 *  - quand on blure d'une mesure quelconque
 * 
 */
setWidth(){
  console.log("-> setWidth")
  // 
  // On prend le texte le plus long
  // 
  var max = 0
  this.eachObjetMesure(mes => {
    var c = mes.value.trim()
    if ( c.length > max ) max = c.length
  })
  // 
  // Une valeur minimale
  // 
  max || (max = 8);

  // 
  // On met tous les champs à la même longueur
  // 
  this.eachObjetMesure(mes => {
    mes.style.width = px(max * 18)
  })
}

/**
 * Pour se placer dans le premier champ (en haut)
 * 
 */
focus(){
  this.obj.querySelector('.mesure_code.portee1').focus()
}

/**
 * Méthode pour définir le numéro de mesure de cette mesure-code et
 * l'afficher au-dessus des champs
 * 
 */
updateMeasureNumber(){
  this._number = null
  this.obj.querySelector('.mesure_number').innerHTML = this.number
}
get number(){return this._number || (this._number = this.calcNumber())}
set number(v){this._number = v}
calcNumber(){
  return this.id + this.constructor.firstMeasureNumber - 1
}
/**
 * Méthode qui boucle sur chaque champ de texte de mesure de
 * cette mesure-code
 * 
 */
eachObjetMesure(methode){
  for (var iportee = 1; iportee <= Score.stavesCount; ++iportee) {
    const omesure = this.obj.querySelector('.mesure_code.portee' + iportee)
    methode(omesure)
  }  
}

/**
 * Méthode de construction de la mesure-code
 */
build(){
  const o = DCreate('DIV', {class:'mesure_code'})
  // 
  // On met le champ pour le numéro de mesure
  // 
  o.appendChild(DCreate('DIV', {class:'mesure_number', text: this.number}))
  /**
   * 
   * On ajoute autant de systèmes qu'il en faut
   * 
   */
  for (var isys = 0; isys < Score.stavesCount; ++isys) {
    o.appendChild(DCreate('INPUT', {type:'text', class:'mesure_code portee' + (isys + 1)}))
  }
  this.obj = o

  this.constructor.container.appendChild(this.obj)

  this.observe()

}

observe(){
  console.log("-> observe", this)
  this.eachObjetMesure(mes => {
    mes.addEventListener('blur', this.setWidth.bind(this))
    mes.addEventListener('focus', this.setCurrent.bind(this, mes))
  })
}

/**
 * Pour mettre cette mesure (et ce champ en courant)
 * 
 * Pour bien comprendre : cette mesure-code contient chaque portée
 * du système. Par exemple, elle contient 4 mesures pour un quatuor,
 * donc 4 champs pour entrer les notes.
 * Quand on focusse dans un champ on a donc :
 *    - MesureCode.current      Qui est l'instance mesureCode courante (celle du champ focussé)
 *    - <cette mesure>.current  Qui est le field de la mesure en question (si vraiment c'est nécessaire, à l'avenir, on pourra imaginer faire une instance.
 */
setCurrent(field, ev){
  this.currentField = field
  this.constructor.current = this
  return stopEvent(ev)
}

/**
 * Méthode pour ajouter le texte +text+ au champ courant de cette
 * mesure-code, donc le currentField
 * 
 */
addInCurrentStaff(text){
  var t = this.getCurrentFieldContent().trim()
  this.setCurrentFieldTo(t + ' ' + text)
}
setCurrentFieldTo(txt){
  this.currentField.value = txt
  this.setWidth()
}
getCurrentFieldContent(){
  return this.currentField.value
}


}//class MesureCode
