'use strict';

class AppClass {

/**
 * Méthode qui soumet le code par Ajax pour construire l'image
 * 
 */
submitCode(){
  message("Actualisation en cours…", {keep: true})
  const finalCode = Score.getCodeFinal()
  //
  // On met le nom de l'image dans le formulaire (même si ce nom est
  // non défini)
  // 
  document.querySelector('#image_name_in_form').value = Options.getImageName()
  // 
  // Envoi du code ou renoncement
  // 
  if ( ! finalCode ) {
    // 
    // S'il n'y a pas de code final (pour une erreur quelconque)
    // 
    console.error("Il n'y a pas de code… Score.getCodeFinal() n'a rien renvoyé.")
    return erreur("Une erreur s'est produite. Consulter la console.")
  } else {
    // console.log("finalCode = ", finalCode)
    ajax('build_score', finalCode).then(ret => {
      console.log("Retour ajax", ret)
      Score.update()
      message("Partition actualisée.")
    })
  }
}

/**
 *
 * Méthode générale principale traitant un code complet donné
 * (ou remonté au lancement) 
 */
traiteCodeInitial(fullcode){
  if ( undefined == fullcode ) {
    fullcode = document.querySelector('#ini_code').value
  }
  if ( fullcode == '') {
    return error("Aucun code n'a été fourni.")
  }
  // console.log("Je dois traiter le code : ", fullcode)
  // 
  // On passe en revue chaque ligne pour définir les options
  // 
  var notes   = [] 
  var options = {}
  fullcode.split("\n").forEach(line => {
    line = line.trim()
    if ( line.substring(0, 2) == '->') {
      // 
      // Nom de l'image. Par défaut, c'est 'visu' et il ne faut rien
      // faire, sinon, c'est le nom qu'on doit mettre dans le champ
      // adéquat
      // 
      const image_name = line.substring(2, line.length).trim()
      if ( image_name != 'visu' ) Options.setImageName(image_name) ;
    } else if ( line.substring(0, 2) == '--' ){
      // 
      // Une options quelconque
      // 
      var opts = line.substring(2, line.length).split(' ')
      var option = opts.shift()
      var valoption = opts.join(' ')
      switch(option){
        case'piano': case'solo': case'duo': case'trio': case'quatuor':
          console.info("Option %s rencontrée", option)
          valoption = option
          option    = 'systeme' 
          break
      }
      if ( valoption == '' ) valoption = true
      // console.log("L'option '%s' est mise à %s", option, valoption)
      options[option] = valoption
    } else {
      notes.push(line)
    }
  })
  // 
  // Pour mémoire
  // 
  Options.data_ini = options
  // 
  // Traitement des options
  //
  Staff.reset()
  Options.applique(options)
  // 
  // Traitement des notes
  // 
  notes = notes.join("\n").trim()
  // console.info("Notes récupérées : ", notes )
  MesureCode.parse(notes)
}

/**
 * Procédure normale de production du code
 * 
 * Noter que la différence avec le code qui est envoyé au constructeur,
 * ici, on ajoute au code le nom de l'image, s'il est défini. Pour le
 * constructeur, c'est toujours 'visu'
 */
produceFinalCode(){
  var params = {}
  const field = document.querySelector('#final_code')
  const cbVariables = document.querySelector('#cb_mesures_in_variable')
  Object.assign(params, {variables: cbVariables.checked})
  let from_mes  = document.querySelector('#output_from_mesure').value.trim()
  from_mes  = from_mes == '' ? 1 : parseInt(from_mes,10)
  Object.assign(params, {from: from_mes})
  let to_mes    = document.querySelector('#output_to_mesure').value.trim()
  to_mes    = to_mes == '' ? Score.count : to_mes
  Object.assign(params, {from: from_mes, to:to_mes})
  const imgname = Options.getImageName()
  if ( imgname != '' ) Object.assign(params, {image_name:imgname})

  field.value = Score.getCodeFinal(params)
  field.style.height = px(200)
}


/**
 * Pour forcer la production du code en cas de problème
 * 
 */
forceCodeFinal(){
  const field = document.querySelector('#final_code')
  let codePortees = {}
  // 
  // On boucle sur les mesures tant qu'on en trouve
  // 
  document.querySelectorAll('#mesures_code > div').forEach(div => {
    div.querySelectorAll('input[type="text"][data-portee]').forEach(input => {
      var indexPortee = parseInt(input.getAttribute('data-portee'),10)
      if ( undefined == codePortees[indexPortee] ) {
        Object.assign(codePortees, { [indexPortee]: []})
      }
      codePortees[indexPortee].push(input.value.trim())
    })
  })
  //
  // On rassemble tout le code
  // 
  var code = []
  for( var iportee in codePortees ) {
    code.push(codePortees[iportee].join(' | '))
  }
  code = code.join("\n")
  field.value = code 
  field.style.height = px(200)
}

}//AppClass


const App = new AppClass()
