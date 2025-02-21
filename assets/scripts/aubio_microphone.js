/*******************************
 * Fonctions utilitaires
 *******************************/
function computeRMS(buffer) {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

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

function getRhythmicValue(duration) {
  console.log("Durée mesurée :", duration);
  if (duration < 0.25) return { value: "croche", label: "1/8" };
  else if (duration < 0.5) return { value: "noire", label: "1/4" };
  else if (duration < 1.0) return { value: "blanche", label: "1/2" };
  else return { value: "ronde", label: "1" };
}

/*******************************
 * Variables et paramètres
 *******************************/
let audioContext;
let stream;
let scriptProcessor;
let aubioPitch;
let aubioOnset;

let detectedNotes = []; // Tableau des notes détectées : { pitch, rhythmicValue, rhythmicLabel, duration }
let noteStartTime = null; // Timestamp du début de la note en cours
let isRunning = false;

const bufferSize = 1024;
const hopSize = 128;            // Ajustez selon votre instrument pour une bonne résolution
const RMS_THRESHOLD = 0.03;     // Seuil pour ignorer les bruits faibles

// Période réfractaire pour éviter les déclenchements multiples (en secondes)
const REFRACTORY_PERIOD = 0.5;

// Paramètres d'auto-stop
const MAX_NOTES = 4;          // Arrête l'écoute dès que 4 notes sont détectées
const MAX_DURATION = 5;      // Arrête l'écoute après 10 secondes

let progressBarInterval = null;

/*******************************
 * Gestion du micro avec Aubio.js
 *******************************/
export async function startSuperMicrophone() {
  if (isRunning) return;
  isRunning = true;
  detectedNotes = [];
  noteStartTime = null;
  updateMicIndicator(true);
  resetProgressBar();

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (e) {
    console.error("Erreur d'accès au micro :", e);
    isRunning = false;
    updateMicIndicator(false);
    return;
  }
  const source = audioContext.createMediaStreamSource(stream);

  // Appliquer des filtres pour limiter les bruits parasite (passe-haut et passe-bas)
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 80;
  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1100;
  source.connect(highpass);
  highpass.connect(lowpass);

  // Crée le ScriptProcessor pour analyser l'audio
  scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
  lowpass.connect(scriptProcessor);
  scriptProcessor.connect(audioContext.destination);

  // Vérifiez que la bibliothèque Aubio est chargée
  if (typeof Aubio === "undefined") {
    console.error("Aubio n'est pas défini. Vérifiez l'inclusion de la bibliothèque Aubio.js.");
    isRunning = false;
    updateMicIndicator(false);
    return;
  }
  aubioPitch = new Aubio.Pitch("default", bufferSize, hopSize, audioContext.sampleRate);
  aubioOnset = new Aubio.Onset("default", bufferSize, hopSize, audioContext.sampleRate);

  noteStartTime = audioContext.currentTime;

  // Auto-stop après MAX_DURATION secondes
  setTimeout(() => {
    if (isRunning) {
      console.log("Durée maximale atteinte, arrêt du micro.");
      stopSuperMicrophone();
    }
  }, MAX_DURATION * 1000);

  scriptProcessor.onaudioprocess = function(event) {
    if (!isRunning) return;
    const inputBuffer = event.inputBuffer.getChannelData(0);
    const currentTime = audioContext.currentTime;
    // Filtrer les signaux trop faibles pour éviter le bruit parasite
    const rms = computeRMS(inputBuffer);
    if (rms < RMS_THRESHOLD) return;

    const pitch = aubioPitch.do(inputBuffer);
    const onsetDetected = aubioOnset.do(inputBuffer);
    console.log("onsetDetected =", onsetDetected);

    if (onsetDetected) {
      // Appliquer une période réfractaire
      if (noteStartTime && (currentTime - noteStartTime) < REFRACTORY_PERIOD) {
        return;
      }
      if (noteStartTime !== null) {
        const duration = currentTime - noteStartTime;
        const rhythmicInfo = getRhythmicValue(duration);
        detectedNotes.push({
          pitch: pitch,
          rhythmicValue: rhythmicInfo.value,
          rhythmicLabel: rhythmicInfo.label,
          duration: duration
        });
        console.log(`Note détectée : pitch=${pitch.toFixed(2)} Hz, durée=${duration.toFixed(2)} s => ${rhythmicInfo.value} (${rhythmicInfo.label})`);
        updateStaff(noteFromPitch(pitch));
      }
      noteStartTime = currentTime;
      if (detectedNotes.length >= MAX_NOTES) {
        console.log("Nombre maximal de notes atteint, arrêt du micro.");
        stopSuperMicrophone();
      }
    }
  };

  startProgressBar();
  console.log("Super API Micro démarrée");
}

export function stopSuperMicrophone() {
  if (!isRunning) return;
  isRunning = false;
  
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
      console.log("Track stoppé :", track.label);
    });
    stream = null;
  }
  
  if (scriptProcessor) {
    scriptProcessor.disconnect();
    scriptProcessor = null;
  }
  
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
  console.log("Super API Micro arrêtée. Notes détectées :", detectedNotes);
  return detectedNotes;
}

/*******************************
 * Mise à jour de l'UI
 *******************************/
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

function updateStaff(noteStr) {
  // Utilisation de VexFlow pour dessiner la portée avec les notes détectées
  const VF = Vex.Flow;
  const div = document.getElementById("music-score");
  div.innerHTML = "";
  // On génère le tableau de notes en utilisant detectedNotes
  let vfNotes = detectedNotes.map(noteObj => noteFromPitch(noteObj.pitch));
  if (!vfNotes.length) return;
  const width = Math.max(500, vfNotes.length * 100);
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(width, 200);
  const context = renderer.getContext();
  const stave = new VF.Stave(10, 40, width - 20);
  stave.addClef("treble").setContext(context).draw();
  const notes = vfNotes.map(noteStr => {
    let letter = noteStr[0].toLowerCase();
    let octave = noteStr.slice(-1);
    let key = `${letter}/${octave}`;
    let staveNote = new VF.StaveNote({ clef: "treble", keys: [key], duration: "q" });
    if (noteStr.includes("#")) {
      staveNote.addAccidental(0, new VF.Accidental("#"));
    } else if (noteStr.includes("b")) {
      staveNote.addAccidental(0, new VF.Accidental("b"));
    }
    return staveNote;
  });
  VF.Formatter.FormatAndDraw(context, stave, notes);
}

function startProgressBar() {
  const progressBar = document.getElementById("capture-progress");
  progressBar.style.width = "0%";
  const startTime = Date.now();
  progressBarInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min(100, (elapsed / MAX_DURATION / 1000) * 100);
    progressBar.style.width = percent + "%";
    if (elapsed >= MAX_DURATION * 1000) {
      clearInterval(progressBarInterval);
    }
  }, 50);
}

function resetProgressBar() {
  const progressBar = document.getElementById("capture-progress");
  progressBar.style.width = "0%";
}
