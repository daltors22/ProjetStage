<template>
  <div id="app">
    <HeaderComponent />
    <div class="main-content">
      <PaginatedResults />
      <router-view></router-view> <!-- Contenu de la page -->
    </div>
    <FooterComponent />
  </div>
</template>

<script>
export default {
  name: 'App',
  
};
</script>

<style>

body {
  padding-top: 70px; /* Ajuste en fonction de la hauteur de la navbar */
}

</style>