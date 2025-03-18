const audioFiles = {
    C4: new Audio('./src/assets/acoustic_grand_piano-mp3/C4.mp3'),
    'C#4': new Audio('./src/assets/acoustic_grand_piano-mp3/C4.mp3'),
    D4: new Audio('./src/assets/acoustic_grand_piano-mp3/D4.mp3'),
    'D#4': new Audio('./src/assets/acoustic_grand_piano-mp3/Db4.mp3'),
    E4: new Audio('./src/assets/acoustic_grand_piano-mp3/E4.mp3'),
    F4: new Audio('./src/assets/acoustic_grand_piano-mp3/F4.mp3'),
    'F#4': new Audio('./src/assets/acoustic_grand_piano-mp3/F4.mp3'),
    G4: new Audio('./src/assets/acoustic_grand_piano-mp3/G4.mp3'),
    'G#4': new Audio('./src/assets/acoustic_grand_piano-mp3/Gb4.mp3'),
    A4: new Audio('./src/assets/acoustic_grand_piano-mp3/A4.mp3'),
    'A#4': new Audio('./src/assets/acoustic_grand_piano-mp3/Ab4.mp3'),
    B4: new Audio('./src/assets/acoustic_grand_piano-mp3/B4.mp3'),
    C5: new Audio('./src/assets/acoustic_grand_piano-mp3/C5.mp3'),
  };
  
  export function playNote(note) {
    if (audioFiles[note]) {
      audioFiles[note].currentTime = 0;
      audioFiles[note].play();
    }
  }
  
  export function stopNote(note) {
    if (audioFiles[note]) {
      audioFiles[note].pause();
      audioFiles[note].currentTime = 0;
    }
  }