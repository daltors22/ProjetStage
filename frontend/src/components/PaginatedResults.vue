<template>
  <div class="paginated-result">
    <!-- ✅ Navigation et contrôles -->
    <div class="navigation">
      <label>Nombre de partitions : {{ totalScores }}</label>
      <select v-model="itemsPerPage" @change="resetPagination" class="pagination-select">
        <option :value="12">Défaut</option>
        <option :value="48">Plus de résultats</option>
      </select>
    </div>

    <!-- ✅ Pagination -->
    <div class="navigation">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-bt">Page précédente</button>
      <input type="number" min="1" :max="totalPages" v-model="currentPage" @change="loadPageData" class="page-nb-input">
      <label>/ {{ totalPages }}</label>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-bt">Page suivante</button>
    </div>

    <!-- ✅ Affichage des partitions en grille -->
    <div class="results-container">
      <template v-if="paginatedScores.length > 0">
        <div class="grid-container">
          <div v-for="(score, index) in paginatedScores" :key="index" class="grid-item" @click="openScore(score.collection, score.source)">
            🎵 {{ getFileName(score.source) }}
            <div class="score-preview">
              <img :src="getSvgUrl(score.source)" alt="Partition musicale" @error="handleImageError" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <h2>Aucune partition trouvée</h2>
      </template>
    </div>

    <!-- ✅ Pagination -->
    <div class="navigation">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-bt">Page précédente</button>
      <input type="number" min="1" :max="totalPages" v-model="currentPage" @change="loadPageData" class="page-nb-input">
      <label>/ {{ totalPages }}</label>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-bt">Page suivante</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps } from "vue";
import { useRouter } from 'vue-router';

const props = defineProps(["scores"]);
console.log("📡 Contenu des partitions reçues :", props.scores);

// 📌 Variables réactives
const scores = ref([]);
const totalScores = computed(() => scores.value.length);
const currentPage = ref(1);
const itemsPerPage = ref(12); // Par défaut : 12 partitions par page (3x3)
const totalPages = computed(() => Math.ceil(totalScores.value / itemsPerPage.value));

// 📌 Mise à jour des scores lors du changement de données
watch(() => props.scores, (newScores) => {
  console.log("📡 Mise à jour des partitions :", newScores);
  scores.value = newScores;
  currentPage.value = 1; // Reset la pagination lors du changement d'auteur
});

// 📌 Calcul des partitions à afficher sur la page courante
const paginatedScores = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return scores.value.slice(start, end);
});

// 📌 Extraire le nom du fichier depuis l'URL (ex: "10000_Clergenton.svg" devient "10000_Clergenton")
const getFileName = (path) => {
  return path.split('/').pop().replace('.svg', '');
};

// 📌 Gestion de la pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const resetPagination = () => {
  currentPage.value = 1;
};

// 📌 Fonction pour construire une URL correcte pour les fichiers SVG
const getSvgUrl = (path) => {
  console.log(`🛠 Correction de l'URL pour : ${path}`);
  return `http://127.0.0.1:5000/files${path}`;
};

// 📌 Gestion des erreurs de chargement des images
const handleImageError = (event) => {
  console.error("❌ Erreur de chargement de l'image :", event.target.src);
  event.target.style.display = "none"; // Cache l'image si elle ne charge pas
};

const router = useRouter();

const openScore = (author, scorePath) => {
  const formattedAuthor = author.replace(/\s+/g, "-");

  // 🔥 Remplace `.svg` par `.mei` pour récupérer le bon fichier
  const formattedScore = scorePath.replace(/\/svg\//, "/mei/").replace(".svg", ".mei");

  // ✅ Ouvre un nouvel onglet avec l'URL formatée
  const url = `/result?author=${formattedAuthor}&score_name=${formattedScore}`;
  window.open(url, '_blank'); // '_blank' = ouvrir dans un nouvel onglet
};



const formatTitle = (filename) => {
  return filename.replace(".mei", "").replace(".svg", ""); // Supprime l'extension
};
</script>

<style scoped>
/* ✅ Affichage des partitions en grille */
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* ✅ Toujours 3 colonnes */
  gap: 20px;
  width: 1100px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.grid-item {
  background: #f8f8f8;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%; /* ✅ Taille uniforme */
  overflow-x: hidden;
}

.grid-item:hover {
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.5);
}

.score-preview {
  margin-top: 10px;
  text-align: center;
}

.score-preview img {
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: auto;
}

/* ✅ Styles pour la navigation */
.navigation {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.pagination-bt {
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-bt:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.page-nb-input {
  width: 50px;
  text-align: center;
  padding: 5px;
}

.pagination-select {
  padding: 5px;
  margin-left: 10px;
}
</style>
