<template>
  <div>
    <!-- Search bar -->
    <div class="searchbar-box">
      <h1 class="searchbar-title">Rechercher dans le contenu des partitions</h1>
    </div>

    <!-- Toasts -->
    <div v-if="showHelpToast" class="toast custom-toast align-items-center text-bg-warning border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
      <div class="d-flex">
        <a href="#">
          <div class="toast-body text-center text-white">
            Aide/astuce
            <i class="bi bi-lightbulb-fill me-2"></i>
          </div>
        </a>
        <button @click="closeToast('help')" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>

    <!-- Microphone Search Toast -->
    <div v-if="showMicroToast" class="toast1 custom-toast1 align-items-center text-bg border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
      <div class="d-flex">
        <a href="#">
          <div class="toast-body text-center text-white">
            <p>Micro</p>
            <i class="bi bi-mic-fill"></i>
          </div>
        </a>
      </div>
    </div>

    <!-- Music score section -->
    <div class="content-wrapper d-flex flex-column" style="align-items: center !important; justify-content: center !important;">
      <div class="search-pattern">
        <h1>Rechercher un motif musical</h1>
        <div id="music-score"></div>
        <div class="clear_buttons">
          <button @click="clearAll" type="button" class="btn btn-info text-white" style="background-color: #7ab6e0;" id="clear_all">Supprimer tout</button>
          <button @click="removeLastNote" type="button" class="btn btn-info text-white" style="background-color: #7ab6e0;" id="clear_last_note">Supprimer la dernière note</button>
          <button @click="playMelody" type="button" class="btn btn-info text-white" style="background-color: #7ab6e0;" id="play_melody">Jouer la mélodie</button>
        </div>
      </div>

      <!-- Volume and Octave control -->
      <div class="wrapper">
        <header>
          <div class="column volume-slider">
            <span>Volume</span>
            <input type="range" v-model="volume" min="0" max="1" value="0.5" step="any" />
          </div>
          <div class='octave-modif'>
            <div class='octave-modif-bt-div'>
              <button @click="changeOctave(-1)" class="btn btn-outline-secondary text-white octave-modif-bt" data-key="<" id="octave-minus"><span>Octave - (c)</span></button>
              <button @click="changeOctave(1)" class="btn btn-outline-secondary text-white octave-modif-bt" data-key=">" id="octave-plus"><span>Octave + (v)</span></button>
            </div>
            <label id="octave-lb" class="white-label">{{ octave }}</label>
          </div>
          <div class="column keys-checkbox">
            <span>Touches</span>
            <input type="checkbox" checked />
          </div>
        </header>

        <!-- Piano keys -->
        <ul class="piano-keys">
          <li v-for="key in pianoKeys" :key="key.id" :class="['key', key.color]" @mousedown="keyDown(key)" @mouseup="keyUp(key)">
            <span>{{ key.label }} <br /> {{ key.key }}</span>
          </li>
        </ul>

        <!-- Silence and Rhythm modification -->
        <div class="d-flex gap-4">
          <button class="m-5" data-key="r" id="silence-bt">
            <span>
              <img src="/src/assets/public/silences_pics/s1.png" height="40px" alt="Silence" />
              /
              <img src="/src/assets/public/silences_pics/s4.png" height="40px" />
              /
              <img src="/src/assets/public/silences_pics/s8.png" height="40px" />
              (b)
            </span>
          </button>

          <div class="rhythm-modif">
            <button class="rhythm-modif-bt" data-key="w" id="whole-bt">
              <img src="/src/assets/public/notes_pics/1.png" height="50px" alt="Whole" />
            </button>
            <button class="rhythm-modif-bt" data-key="hd" id="half-dotted-bt">
              <img src="/src/assets/public/notes_pics/2d.png" height="50px" alt="Dotted half" />
            </button>
            <button class="rhythm-modif-bt" data-key="h" id="half-bt">
              <img src="/src/assets/public/notes_pics/2.png" height="50px" alt="Half" />
            </button>
            <button class="rhythm-modif-bt" data-key="qd" id="quarter-dotted-bt">
              <img src="/src/assets/public/notes_pics/4d.png" height="50px" alt="Dotted quarter" />
            </button>
            <button class="rhythm-modif-bt" data-key="q" id="quarter-bt">
              <img src="/src/assets/public/notes_pics/4.png" height="50px" alt="Quarter" />
            </button>
            <button class="rhythm-modif-bt" data-key="8d" id="8th-dotted-bt">
              <img src="/src/assets/public/notes_pics/8d.png" height="50px" alt="Dotted 8-th" />
            </button>
            <button class="rhythm-modif-bt" data-key="8" id="8th-bt">
              <img src="/src/assets/public/notes_pics/8.png" height="50px" alt="8-th" />
            </button>
            <button class="rhythm-modif-bt" data-key="16d" id="16th-dotted-bt">
              <img src="/src/assets/public/notes_pics/16d.png" height="50px" alt="Dotted 16-th" />
            </button>
            <button class="rhythm-modif-bt" data-key="16" id="16th-bt">
              <img src="/src/assets/public/notes_pics/16.png" height="50px" alt="16-th" />
            </button>
            <button class="rhythm-modif-bt" data-key="32d" id="32th-dotted-bt">
              <img src="/src/assets/public/notes_pics/32d.png" height="50px" alt="Dotted 32-th" />
            </button>
            <button class="rhythm-modif-bt" data-key="32" id="32th-bt">
              <img src="/src/assets/public/notes_pics/32.png" height="50px" alt="32-th" />
            </button>
          </div>
        </div>
      </div>

      <!-- Collections options -->
      <div class="flex-column" style="display: flex; justify-content: space-between; gap: 20px;">
        <div class="collections-options">
          <label for="collections">Collection dans lesquelles rechercher :</label><br />
          <select v-model="selectedCollection" id="collections" name="collections">
            <option v-for="(collection, index) in collections" :key="index" :value="collection">
              {{ collection }}
            </option>
          </select>
        </div>

        <!-- Search mode buttons -->
        <div class="flex-column" style="display: flex; gap: 20px;">
          <h4 class="text-center">Sélectionnez le type de recherche</h4>
          <div class="flex-row" style="display: flex; gap: 40px;">
            <button @click="searchExact" id="stricte" type="button" class="btn text-white tooltip-lb" style="background-color: #7ab6e0;">Recherche exacte</button>
            <button @click="searchWithTolerance" id="modereeMelo" type="button" class="btn text-white" style="background-color: #7ab6e0;">Recherche avec tolérance <br /> sur la hauteur des notes</button>
            <button @click="searchWithRhythmTolerance" id="modereeRythm" type="button" class="btn text-white" style="background-color: #7ab6e0;">Recherche avec tolérance <br /> sur le rythme</button>
          </div>
        </div>

        <!-- Advanced options button -->
        <button @click="toggleAdvancedOptions" id="toggleButton2" class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample" data-button="options2">
          Options avancées
        </button>

        <!-- Advanced options -->
        <div style="min-height: 120px;">
          <div class="collapse collapse-vertical" id="collapseWidthExample">
            <div class="card card-body" style="width: 300px;">
              <div class="general-options">
                <label class="tooltip-lb" id="pitch-lb">
                  <input v-model="pitchChecked" type="checkbox" />
                  Hauteur des notes
                </label><br />
                <label class="tooltip-lb" id="rhythm-lb">
                  <input v-model="rhythmChecked" type="checkbox" />
                  Rythme
                </label><br />
                <label class="tooltip-lb" id="transpose-lb">
                  <input v-model="transposeChecked" type="checkbox" />
                  Autoriser les transpositions
                </label><br />
              </div>
              <div class="fuzzy-options">
                <label class="tooltip-lb" id="pitch-dist-lb">
                  Tolérance de hauteur
                  <input v-model="pitchTolerance" type="number" min="0" value="0" step="0.5" class="nb-select" />
                </label><br />
                <label class="tooltip-lb" id="duration-dist-lb">
                  Facteur de durée
                  <input v-model="durationFactor" type="number" min="1" value="1" step="0.125" class="nb-select-large" />
                </label><br />
                <label class="tooltip-lb" id="sequencing-dist-lb">
                  Écart de durée
                  <input v-model="durationGap" type="number" min="0" value="0" step="0.125" class="nb-select-large" />
                </label><br />
                <label class="tooltip-lb" id="alpha-lb">
                  Alpha
                  <input v-model="alpha" type="number" min="0" max="100" value="0" step="5" class="nb-select" />
                  %
                </label>
                <hr />
                <div class="clear_buttons">
                  <button @click="searchWithAdvancedOptions" type="button" class="btn text-white send-button" style="background-color: #006485;" id="send-button">Recherche</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast notifications -->
      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div v-if="toastVisible" class="toast align-items-center text-bg-white border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header text-white" style="background-color: #006485;">
            <strong class="me-auto">{{ toastTitle }}</strong>
            <button type="button" class="btn-close" style="background-color: white;" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ toastMessage }}
          </div>
        </div>
      </div>

    </div>

    <!-- Tooltip (hidden by default) -->
    <div id="tooltip" class="info-note" style="display: none;"></div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      volume: 0.5,
      octave: 4,
      melody: [],
      showHelpToast: true,
      showMicroToast: false,
      selectedCollection: '',
      collections: ['Collection 1', 'Collection 2'],
      pianoKeys: [
        { id: 'C4', label: 'DO(C)', color: 'white', key: 'q' },
        { id: 'C#4', label: 'DO#(c#)', color: 'black', key: 'z' },
        { id: 'D4', label: 'RE(D)', color: 'white', key: 's' },
        { id: 'D#4', label: 'RE#(D#)', color: 'black', key: 'e' },
        { id: 'E4', label: 'MI(E)', color: 'white', key: 'd' },
        { id: 'F4', label: 'FA(F)', color: 'white', key: 'f' },
        { id: 'F#4', label: 'FA#(F#)', color: 'black', key: 't' },
        { id: 'G4', label: 'SOL(G)', color: 'white', key: 'g' },
        { id: 'G#4', label: 'SOL#(G#)', color: 'black', key: 'y' },
        { id: 'A4', label: 'LA(A)', color: 'white', key: 'h' },
        { id: 'A#4', label: 'LA#(A#)', color: 'black', key: 'u' },
        { id: 'B4', label: 'SI(B)', color: 'white', key: 'j' },
        { id: 'C5', label: 'DO(C)', color: 'white', key: 'k' },
        { id: 'C#5', label: 'DO#(C#)', color: 'black', key: 'o' },
        { id: 'D5', label: 'RE(D)', color: 'white', key: 'l' },
        { id: 'D#5', label: 'RE#(D#)', color: 'black', key: 'p' },
        { id: 'E5', label: 'MI(E)', color: 'white', key: 'm' },
        { id: 'F5', label: 'FA(F)', color: 'white', key: 'ù' },
        { id: 'F#5', label: 'FA#(F#)', color: 'black', key: ')' },
        { id: 'G5', label: 'SOL(G)', color: 'white', key: '*' },
        { id: 'G#5', label: 'SOL#(G#)', color: 'black', key: '$' },
        { id: 'A5', label: 'LA(A)', color: 'white', key: '_' },
        { id: 'A#5', label: 'LA#(A#)', color: 'black', key: '_' },
        { id: 'B5', label: 'SI(B)', color: 'white', key: '_' }
      ],
      pitchChecked: true,
      rhythmChecked: true,
      transposeChecked: false,
      pitchTolerance: 0,
      durationFactor: 1,
      durationGap: 0,
      alpha: 0,
      toastVisible: false,
      toastTitle: '',
      toastMessage: ''
    };
  },
  methods: {
    clearAll() {
      this.melody = [];
    },
    removeLastNote() {
      this.melody.pop();
    },
    playMelody() {
      console.log('Jouer la mélodie');
    },
    changeOctave(diff) {
      this.octave += diff;
      if (this.octave < 1) this.octave = 1;
      if (this.octave > 6) this.octave = 6;
    },
    keyDown(key) {
      console.log(`Appuyer sur la touche: ${key.id}`);
      // Ajouter la logique de la touche
    },
    keyUp(key) {
      console.log(`Relâcher la touche: ${key.id}`);
      // Ajouter la logique pour relâcher la touche
    },
    searchExact() {
      this.toastVisible = true;
      this.toastTitle = 'Recherche exacte';
      this.toastMessage = 'Vous effectuez une recherche exacte !';
      setTimeout(() => {
        this.toastVisible = false;
      }, 3000);
    },
    searchWithTolerance() {
      this.toastVisible = true;
      this.toastTitle = 'Recherche approchée';
      this.toastMessage = 'Vous effectuez une recherche approchée sur la hauteur des notes.';
      setTimeout(() => {
        this.toastVisible = false;
      }, 3000);
    },
    searchWithRhythmTolerance() {
      this.toastVisible = true;
      this.toastTitle = 'Recherche approximative';
      this.toastMessage = 'Vous effectuez une recherche approximative sur la durée des notes.';
      setTimeout(() => {
        this.toastVisible = false;
      }, 3000);
    },
    toggleAdvancedOptions() {
      this.showAdvancedOptions = !this.showAdvancedOptions;
    },
    closeToast(toastType) {
      if (toastType === 'help') {
        this.showHelpToast = false;
      } else if (toastType === 'micro') {
        this.showMicroToast = false;
      }
    },
    searchWithAdvancedOptions() {
      console.log('Recherche avec options avancées');
      // Logique de recherche avec options avancées
    }
  }
};
</script>

<style scoped>
.clear_buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
.stave_buttons {
  width: 130px;
  height: 60px;
  border-radius: 20px;
  background-color: #62aadd;
  color: #fff;
  font-size: 16px;
  text-align: center;
  border: none;
  outline: none;
  cursor: pointer;
  margin: 10px;
}
.stave_buttons:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}
.piano-keys {
  display: flex;
}
.piano-keys .key {
  cursor: pointer;
}
.rhythm-modif button {
  width: 50px;
  height: auto;
}
</style>
