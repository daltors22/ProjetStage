<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top border-bottom shadow bg-body-tertiary">
      <div class="container-fluid">
          <a class="navbar-brand" href="/">La plateforme SKRID</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul class="navbar-nav">
                  <li class="nav-item"><router-link class="nav-link" to="/">SKRID</router-link></li>
                  <li class="nav-item"><router-link class="nav-link" to="/plus">En savoir plus</router-link></li>
                  <li class="nav-item"><router-link class="nav-link" to="/references">Références</router-link></li>
                  <li class="nav-item"><router-link class="nav-link" to="/collections">Collections</router-link></li>
                  <li class="nav-item"><router-link class="nav-link" to="/searchinterface">Recherche</router-link></li>
              </ul>
          </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'HeaderComponent'
  };
  </script>
  
  <style scoped>
  .navbar {
    padding: 1%;
  }
  </style>