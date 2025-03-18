<template>
  <div class="collections-container">
    <div class="searchbar-box">
      <h1 class="searchbar-title p-2 text-center">Les collections</h1>
    </div>

    <div class="father_container d-flex flex-row gap-1">
      <!-- MENU LEFT -->
      <div id="menuCollection" class="card-lg shadow bg-body-tertiary gap-5 position-fixed rounded-end"
           style="width: 18rem; top: 30px; left: 0; height: 60vh; z-index: 1;">
        <div class="card-header text-center fs-1 d-flex flex-column">
          <i class="bi bi-people-fill fs-1" style="color: #006485;"></i>
          Collections
        </div>
        <hr />
        <br />
        <div class="list-group gap-5">
          <button v-for="(author, index) in authors" :key="index"
                  class="btn list-group-item-action w-75 mx-auto d-flex align-items-center"
                  :class="{ 'active': author === selectedAuthor }"
                  @click="fetchPageData(author)">
            {{ author }}
          </button>
        </div>
      </div>

      <!-- PARTITIONS VIEW -->
      <div class="archives" style="margin-left: 18rem;">
        <p id="archives" class="text-secondary m-4">{{ archivesText }}</p>
        <PaginatedResults :scores="scores" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import PaginatedResults from "../components/PaginatedResults.vue";

// 📌 Variables réactives
const authors = ref([]);
const scores = ref([]);
const selectedAuthor = ref("");  // Auteur sélectionné
const archivesText = ref("Sélectionnez une collection pour voir les partitions.");

// 📌 Charger les auteurs
const fetchAuthors = async () => {
  try {
    console.log("📡 Récupération des collections...");
    
    const response = await axios.get("http://127.0.0.1:5000/collections", {
      headers: { Accept: "application/json" }
    });

    authors.value = response.data.authors;
    console.log("✅ Collections chargées :", authors.value);

    // 📌 Charger les partitions du PREMIER auteur automatiquement
    if (authors.value.length > 0) {
      fetchPageData(authors.value[0]);  // Charge directement le premier auteur
    }
  } catch (error) {
    console.error("❌ Erreur de chargement des collections:", error);
  }
};

// 📌 Charger les partitions d'un auteur
const fetchPageData = async (author) => {
  try {
    console.log(`📡 Chargement des partitions pour ${author}...`);
    
    let formattedAuthor = author.replace(/\s+/g, "-"); 

    const response = await axios.get("http://127.0.0.1:5000/collections/getCollectionByAuthor", {
      params: { author: formattedAuthor },
      headers: { Accept: "application/json" }
    });

    scores.value = response.data.results;
    selectedAuthor.value = author;
    archivesText.value = `Télécharger la collection ${author} sous la forme d'une archive :`;

    console.log("✅ Partitions chargées dans CollectionsView:", scores.value);
  } catch (error) {
    console.error("❌ Erreur lors du chargement des partitions:", error);
  }
};
onMounted(async () => {
  await fetchAuthors();
  if (authors.value.length > 0) {
    console.log("📡 Chargement des partitions au démarrage pour :", authors.value[0]);  // 🔥 Vérifie que ça s'exécute
    fetchPageData(authors.value[0]); 
  }
});
</script>

<style scoped>

#menuCollection{
  margin-top: 8%;
}

</style>