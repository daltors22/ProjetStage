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

// === Mise en place de l'écoute micro ===
let audioContext;
let microphoneStream;
let scriptProcessor;
let isListening = false;
let detectedNotes = []; // On accumulera ici des chaînes au format Python

async function startMicrophone() {
  if (isListening) return;
  isListening = true;
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphoneStream = stream;
    const source = audioContext.createMediaStreamSource(stream);
    
    // Création d'un ScriptProcessor pour analyser les données audio (buffer de 2048 échantillons)
    scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
    source.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    scriptProcessor.onaudioprocess = function(event) {
      const buffer = event.inputBuffer.getChannelData(0);
      const pitch = autoCorrelate(buffer, audioContext.sampleRate);
      if (pitch !== -1) {
        const note = noteFromPitch(pitch);
        const formattedNote = formatNote(note);
        // Évite les doublons en comparant la dernière note ajoutée
        if (detectedNotes.length === 0 || detectedNotes[detectedNotes.length - 1] !== formattedNote) {
          detectedNotes.push(formattedNote);
          // Affiche simplement le nom de la note (ou vous pouvez afficher toute la chaîne)
          document.getElementById('detected-notes').textContent = detectedNotes.join(', ');
          // Construit la chaîne représentant la liste Python des notes et la place dans le champ caché
          document.getElementById('notes-input').value = '[' + detectedNotes.join(', ') + ']';
        }
      }
    };

  } catch (error) {
    console.error("Erreur lors de l'accès au micro :", error);
  }
}

function stopMicrophone() {
  isListening = false;
  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => track.stop());
  }
  if (audioContext) {
    audioContext.close();
  }
}

// Fonction qui formate la note détectée pour correspondre au format Python attendu
function formatNote(noteStr) {
  // Par exemple, "B4" devient "[('b', 4), 4, 0]"
  const noteLetter = noteStr.slice(0, noteStr.length - 1).toLowerCase();
  const octave = parseInt(noteStr.slice(-1), 10);
  return `[('${noteLetter}', ${octave}), 4, 0]`;
}

// Événements sur les boutons de démarrage/arrêt
document.getElementById('start-mic').addEventListener('click', startMicrophone);
document.getElementById('stop-mic').addEventListener('click', stopMicrophone);
