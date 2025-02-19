// === Algorithme d'autocorrélation pour détecter la fréquence ===
function autoCorrelate(buffer, sampleRate) {
  const SIZE = buffer.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) // signal trop faible
    return -1;

  let r1 = 0, r2 = SIZE - 1, threshold = 0.2;
  for (let i = 0; i < SIZE; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }
  buffer = buffer.slice(r1, r2);
  const newSize = buffer.length;
  
  const c = new Array(newSize).fill(0);
  for (let i = 0; i < newSize; i++) {
    for (let j = 0; j < newSize - i; j++) {
      c[i] += buffer[j] * buffer[j + i];
    }
  }
  
  let d = 0;
  while (d < newSize - 1 && c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < newSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  const T0 = maxpos;
  return sampleRate / T0;
}

// === Conversion fréquence -> numéro de note puis en nom de note ===
function frequencyToNoteNumber(frequency) {
  return 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
}

function noteFromPitch(frequency) {
  const noteNumber = Math.round(frequencyToNoteNumber(frequency));
  const noteIndex = noteNumber % 12;
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(noteNumber / 12) - 1;
  return noteNames[noteIndex] + octave;
}

// === Variables globales pour la capture et l'affichage ===
let audioContext;
let microphoneStream;
let scriptProcessor;
let isListening = false;
let detectedNotes = []; // Pour le format requis (ex: "[('c', 4), 4, 0]")
let vfNotes = [];       // Pour l'affichage sur la portée (ex: "C4")

// Paramètres de détection
const MAX_NOTES = 4;          // Nombre maximum de notes à capter
const MEASURE_DURATION = 4000; // Durée d'une mesure en ms (ici 4 sec)

let progressBarInterval;

/**
 * Fonction pour démarrer la capture audio.
 */
async function startMicrophone() {
  if (isListening) return;
  isListening = true;
  detectedNotes = [];
  vfNotes = [];
  resetProgressBar();
  
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphoneStream = stream;
    const source = audioContext.createMediaStreamSource(stream);
    
    // Filtres pour limiter les bruits parasites
    const highpassFilter = audioContext.createBiquadFilter();
    highpassFilter.type = 'highpass';
    highpassFilter.frequency.value = 80; // élimine les basses fréquences
    
    const lowpassFilter = audioContext.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.value = 1100; // élimine les hautes fréquences
    
    source.connect(highpassFilter);
    highpassFilter.connect(lowpassFilter);
    
    // Création d'un ScriptProcessor pour analyser l'audio (buffer de 2048 échantillons)
    scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
    lowpassFilter.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    
    // Auto-stop après MEASURE_DURATION millisecondes
    setTimeout(() => {
      if (isListening) {
        console.log("Durée maximale atteinte, arrêt du micro.");
        stopMicrophone();
      }
    }, MEASURE_DURATION);
    
    scriptProcessor.onaudioprocess = function(event) {
      // Auto-stop si nombre de notes atteint
      if (detectedNotes.length >= MAX_NOTES) {
        console.log("Nombre maximal de notes atteint, arrêt du micro.");
        stopMicrophone();
        return;
      }
      const buffer = event.inputBuffer.getChannelData(0);
      const pitch = autoCorrelate(buffer, audioContext.sampleRate);
      if (pitch !== -1) {
        const note = noteFromPitch(pitch);
        const formattedNote = formatNote(note);
        // Ici, on ajoute la note même si identique à la précédente (pas de filtre sur doublon)
        detectedNotes.push(formattedNote);
        document.getElementById('detected-notes').textContent = detectedNotes.join(', ');
        document.getElementById('notes-input').value = '[' + detectedNotes.join(', ') + ']';
        
        // Mise à jour pour la portée (VexFlow)
        vfNotes.push(note);
        updateStaff();
      }
    };
    startProgressBar();
  } catch (error) {
    console.error("Erreur lors de l'accès au micro :", error);
  }
}

/**
 * Fonction pour arrêter la capture audio et libérer toutes les ressources.
 */
function stopMicrophone() {
  isListening = false;
  
  // Arrête chaque piste du flux
  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => {
      track.stop();
      console.log("Track stoppé :", track.label);
    });
    microphoneStream = null;
  }
  
  // Déconnecte le ScriptProcessor et le met à null
  if (scriptProcessor) {
    scriptProcessor.disconnect();
    scriptProcessor = null;
  }
  
  // Ferme l'AudioContext et le met à null
  if (audioContext) {
    audioContext.close().then(() => {
      console.log("AudioContext fermé");
      audioContext = null;
      updateMicIndicator(false);
    }).catch(err => {
      console.error("Erreur lors de la fermeture de l'AudioContext :", err);
      updateMicIndicator(false);
    });
  } else {
    updateMicIndicator(false);
  }
  
  clearInterval(progressBarInterval);
}

/**
 * Formatte la note pour le back-end (par exemple, "[('c', 4), 4, 0]").
 */
function formatNote(noteStr) {
  const noteLetter = noteStr.slice(0, noteStr.length - 1).toLowerCase();
  const octave = parseInt(noteStr.slice(-1), 10);
  return `[('${noteLetter}', ${octave}), 4, 0]`;
}

/* --- Fonctions d'affichage de la portée avec VexFlow --- */

// Convertit une note (ex: "C4" ou "C#4") en format VexFlow (ex: "c/4" ou "c#/4")
function noteToVFKey(noteStr) {
  if (!noteStr) return "";
  let letter = noteStr[0].toLowerCase();
  let accidental = "";
  let octave = "";
  if (noteStr.length === 2) {
    octave = noteStr[1];
  } else if (noteStr.length === 3) {
    if (noteStr[1] === '#' || noteStr[1] === 'b') {
      accidental = noteStr[1];
      octave = noteStr[2];
    } else {
      octave = noteStr.slice(1);
    }
  } else {
    octave = noteStr.slice(-1);
  }
  return accidental ? `${letter}${accidental}/${octave}` : `${letter}/${octave}`;
}

// Dessine la portée et ajoute les notes accumulées (s'il y en a)
function updateStaff() {
  const VF = Vex.Flow;
  const div = document.getElementById("music-score");
  div.innerHTML = ""; // Efface le contenu précédent

  // Largeur minimale de la portée : 500px, plus 100px par note
  const width = Math.max(500, vfNotes.length * 100);
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(width, 200);
  const context = renderer.getContext();
  const stave = new VF.Stave(10, 40, width - 20);
  stave.addClef("treble").setContext(context).draw();

  if (vfNotes.length > 0) {
    const notes = vfNotes.map(noteStr => {
      const key = noteToVFKey(noteStr);
      const staveNote = new VF.StaveNote({ clef: "treble", keys: [key], duration: "q" });
      if (noteStr.includes("#")) {
        staveNote.addAccidental(0, new VF.Accidental("#"));
      } else if (noteStr.includes("b")) {
        staveNote.addAccidental(0, new VF.Accidental("b"));
      }
      return staveNote;
    });
    VF.Formatter.FormatAndDraw(context, stave, notes);
  }
}

/* --- Barre de progression --- */
function startProgressBar() {
  const progressBar = document.getElementById("capture-progress");
  progressBar.style.width = "0%";
  const startTime = Date.now();
  progressBarInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min(100, (elapsed / MEASURE_DURATION) * 100);
    progressBar.style.width = percent + "%";
    if (elapsed >= MEASURE_DURATION) {
      clearInterval(progressBarInterval);
    }
  }, 50);
}

function resetProgressBar() {
  const progressBar = document.getElementById("capture-progress");
  progressBar.style.width = "0%";
}

/* --- Indicateur d'état du micro --- */
function updateMicIndicator(isActive) {
  const indicator = document.getElementById("mic-indicator");
  if (indicator) {
    if (isActive) {
      indicator.textContent = "Micro actif";
      indicator.classList.add("active");
      indicator.classList.remove("inactive");
    } else {
      indicator.textContent = "Micro arrêté";
      indicator.classList.add("inactive");
      indicator.classList.remove("active");
    }
  }
}

/* --- Initialisation au chargement de la page --- */
document.addEventListener("DOMContentLoaded", () => {
  updateStaff(); // Affiche une portée vide dès le départ
});

/* --- Événements sur les boutons --- */
document.getElementById('start-mic').addEventListener('click', startMicrophone);
document.getElementById('stop-mic').addEventListener('click', stopMicrophone);
