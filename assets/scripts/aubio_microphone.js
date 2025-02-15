// aubio_microphone.js

let audioContextAubio;
let streamAubio;
let scriptProcessorAubio;
let aubioPitch;
let aubioOnset;

let detectedNotes = []; // Stocke les notes sous forme d'objets { pitch, rhythmicValue, duration }
let noteStartTime = null; // Timestamp du début de la note en cours

const bufferSize = 1024;
const hopSize = 256; // Vous pouvez ajuster selon vos besoins

/**
 * Mappe une durée (en secondes) à une valeur rythmique.
 * Ajustez ces seuils selon le tempo attendu.
 *
 * Exemple de seuils (pour un tempo modéré) :
 * - Moins de 0.25 sec => croche (1/8)
 * - Entre 0.25 et 0.5 sec => noire (1/4)
 * - Entre 0.5 et 1 sec => blanche (1/2)
 * - Plus de 1 sec => ronde (1)
 */
function getRhythmicValue(duration) {
  console.log("Durée mesurée :", duration);
  if (duration < 0.25) return { value: "croche", label: "1/8" };
  else if (duration < 0.5) return { value: "noire", label: "1/4" };
  else if (duration < 1.0) return { value: "blanche", label: "1/2" };
  else return { value: "ronde", label: "1" };
}

/**
 * Démarre la capture audio avec Aubio.js pour détecter le pitch et les onsets.
 */
export async function startAubioMicrophone() {
  // Initialisation du contexte et du flux audio
  audioContextAubio = new (window.AudioContext || window.webkitAudioContext)();
  streamAubio = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContextAubio.createMediaStreamSource(streamAubio);

  // Création d'un ScriptProcessorNode
  scriptProcessorAubio = audioContextAubio.createScriptProcessor(bufferSize, 1, 1);
  source.connect(scriptProcessorAubio);
  scriptProcessorAubio.connect(audioContextAubio.destination);

  // Initialisation des détecteurs Aubio
  aubioPitch = new Aubio.Pitch("default", bufferSize, hopSize, audioContextAubio.sampleRate);
  aubioOnset = new Aubio.Onset("default", bufferSize, hopSize, audioContextAubio.sampleRate);

  detectedNotes = [];
  noteStartTime = audioContextAubio.currentTime;

  scriptProcessorAubio.onaudioprocess = function(event) {
    console.log("Processing audio…");
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const currentTime = audioContextAubio.currentTime;

    // Détection du pitch
    let pitch = aubioPitch.do(inputBuffer);
    // Vous pouvez vérifier et afficher le pitch si nécessaire :
    // console.log("Pitch :", pitch);

    // Détection d'un onset (début d'une nouvelle note)
    let onsetDetected = aubioOnset.do(inputBuffer);
    if (onsetDetected) {
      // Si une note était en cours, calculez la durée écoulée
      if (noteStartTime !== null) {
        const duration = currentTime - noteStartTime;
        const rhythmicInfo = getRhythmicValue(duration);
        // On enregistre la note précédente avec son pitch et sa valeur rythmique
        detectedNotes.push({
          pitch: pitch,
          rhythmicValue: rhythmicInfo.value,
          rhythmicLabel: rhythmicInfo.label,
          duration: duration
        });
        console.log(
          `Note détectée : pitch=${pitch.toFixed(2)} Hz, durée=${duration.toFixed(2)} s => ${rhythmicInfo.value} (${rhythmicInfo.label})`
        );
        // Ici, vous pouvez appeler une fonction pour mettre à jour l'affichage (par exemple, une portée musicale)
      }
      // Démarrer une nouvelle note
      noteStartTime = currentTime;
    }
  };

  console.log("Aubio microphone démarré");
}

/**
 * Arrête la capture audio et libère les ressources.
 */
export function stopAubioMicrophone() {
    if (streamAubio) {
      streamAubio.getTracks().forEach(track => track.stop());
    }
    if (audioContextAubio) {
      audioContextAubio.close();
    }
    if (scriptProcessorAubio) {
      scriptProcessorAubio.disconnect();
    }
    
    // Correction des erreurs d'octave
    const correctedNotes = correctOctaveErrors(detectedNotes);
    console.log("Capture Aubio arrêtée. Notes corrigées :", correctedNotes);
    
    return correctedNotes;
  }
  

/**
 * Corrige les erreurs d'octave dans la séquence de notes détectées.
 * Ici, on suppose que si deux notes consécutives ont la même lettre mais une différence d’octave de 1,
 * et si cela semble improbable dans le contexte, on force l’octave de la seconde note à celle de la première.
 *
 * @param {Array} notes - Tableau d'objets avec une propriété `pitch` (en Hz).
 * @returns {Array} notes corrigées avec une nouvelle propriété `correctedNote` (par ex. "a4").
 */
function correctOctaveErrors(notes) {
    if (notes.length < 2) return notes;
  
    // On suppose que vous avez une fonction `noteFromPitch` qui convertit une fréquence en note (ex. "a4")
    let correctedNotes = [Object.assign({}, notes[0], { correctedNote: noteFromPitch(notes[0].pitch) })];
  
    for (let i = 1; i < notes.length; i++) {
      let prevNoteStr = noteFromPitch(correctedNotes[i - 1].pitch); // Note précédente corrigée
      let currentNoteStr = noteFromPitch(notes[i].pitch);
      // Extraction de la lettre et de l'octave (ici, on suppose un format "a4", "g#3", etc.)
      let prevLetter = prevNoteStr[0];
      let currLetter = currentNoteStr[0];
      let prevOctave = parseInt(prevNoteStr.slice(-1), 10);
      let currOctave = parseInt(currentNoteStr.slice(-1), 10);
  
      // Si la lettre est identique et que la différence d'octave est de 1, on corrige
      if (prevLetter === currLetter && Math.abs(prevOctave - currOctave) === 1) {
        // On force l'octave de la note actuelle à celle de la note précédente
        currentNoteStr = currLetter + prevNoteStr.slice(-1);
      }
      correctedNotes.push(Object.assign({}, notes[i], { correctedNote: currentNoteStr }));
    }
    return correctedNotes;
  }