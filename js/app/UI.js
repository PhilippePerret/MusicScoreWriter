'use strict';
class UIClass {

  showBoutonsConfirmation(){
    UI.showButtonConfirmer()
    UI.showButtonRenoncer()    
  }
  hideBoutonsConfirmation(){
    UI.hideButtonConfirmer()
    UI.hideButtonRenoncer()
  }

  showButtonConfirmer(){this.btnConfirmer.classList.remove('invisible')}
  hideButtonConfirmer(){this.btnConfirmer.classList.add('invisible')}
  showButtonRenoncer(){this.btnRenoncer.classList.remove('invisible')}
  hideButtonRenoncer(){this.btnRenoncer.classList.add('invisible')}


  // Retourne le numéro du premier système voulu
  getNumberOfFirstSystem(){
    return Number(this.firstNumberField.value || 1)

  }

  // Pour placer le panneau d'information avec le texte +texte+
  showInformation(texte){
    this.panneauInformation.querySelector('.content').innerHTML = texte
    this.panneauInformation.classList.remove('hidden')
  }
  hidePanneauInformation(){
    this.panneauInformation.classList.add('hidden') 
  }


  // Appelée quand on double-clic sur la partition
  onDoubleClickOnScore(e){
    //console.log("e = ", e)
    LigneCoupe.createAt(e.layerY) // NON : clientY
  }

  // Retourne les lignes de coupe
  getTopsOfLignesCoupe(){
    var ls = []
    document.querySelectorAll('div.ligne_coupe').forEach(div => {
      ls.push(unpx(div.style.top))
    })
    return ls.sort(function(a, b) {return a - b});
  }

  get btnConfirmer(){
    return this._btnconfirm || (this._btnconfirm = document.querySelector('button#confirmer_decoupe'))
  }
  get btnRenoncer(){
    return this._btncancel || (this._btncancel = document.querySelector('button#renoncer_decoupe'))
  }
  get score(){return this._score || (this._score = document.querySelector('img#score'))}

  get firstNumberField(){
    return this._firstnum || (this._firstnum = document.querySelector('input#num_first_system'))
  }
  get panneauInformation(){
    return this._infopanel || (this._infopanel = document.querySelector('div#panneau_information'))
  }

}
const UI = new UIClass()
