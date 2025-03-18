<template>
  <div class="piano-container">
    <!-- Buttons for clearing and playing melody -->
    <div class="options-supp-container d-flex gap-2">
      <button class="btn btn-primary" @click="clearAll">Supprimer tout</button>
      <button class="btn btn-primary" @click="removeLastNote">Supprimer la dernière note</button>
      <button class="btn btn-primary" @click="playMelody">Jouer la mélodie</button>
    </div>
    <hr>
    <!-- Octave control buttons -->
    <div class="octave-container d-flex gap-1">
      <button class="btn btn-outline-secondary" @click="changeOctave(-1)">Octave -</button>
      <button class="btn btn-outline-secondary" @click="changeOctave(1)">Octave +</button>
    </div>

    <!-- Piano keys -->
    <div class="piano">
      <div
        v-for="(key, index) in keys"
        :key="index"
        :class="['key', key.isBlack ? 'black' : 'white']"
        @mousedown="playNote(key.note)"
        @mouseup="stopNote(key.note)"
        @mouseleave="stopNote(key.note)"
      >
        <span v-if="!key.isBlack" class="note-label">{{ key.note }}</span>
      </div>
    </div>

    <hr>

    <!-- Figures de notes sous le clavier -->
    <div class="notes-container">
      <div 
          v-for="(note, index) in notesPics" 
          :key="index" 
          class="note-button"
          @click="selectNoteFigure(note.pics)"
      >
        <img :src="getNoteImage(note.pics)" :alt="note.pics" class="note-img" />
      </div>
    </div>

    <hr>

    <!-- Zone d'affichage de la portée -->
    <div id="music-score" style="width: 100%; height: 150px;"></div>
  </div>
</template>

<script>

</script>

<style scoped>
.piano-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  flex-direction: column !important;
  margin-left: 0%;
}

.piano {
  display: flex;
  border-radius: 10px;
  background-color: #222;
  padding: 30px;
}

.key {
  width: 50px;
  height: 170px;
  border: 1px solid black;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  user-select: none;
}

.white {
  background-color: white;
}

.black {
  background-color: black;
  height: 100px;
  width: 30px;
  margin-left: -15px;
  margin-right: -15px;
  z-index: 1;
}

.note-label {
  font-size: 14px;
  color: black;
  position: absolute;
  bottom: 5px;
  cursor: pointer;
}

.notes-container {
  background-color: #222;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;
  padding: 5px;
  border-radius: 0px 0px 5px 5px;
}

.note-button {
  width: 50px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.note-button:hover {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

.note-img {
  width: auto;
  height: 50px;
}

.octave-container {
  background-color: #222;
  padding: 5px;
  border-radius: 5px 5px 0px 0px;
}
</style>
