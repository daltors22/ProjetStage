<template>
    <div class="searchbar-box text-center animate__animated animate__fadeInLeft">
        <h1 class="searchbar-title">Références</h1>
    </div>
    <div class="container mt-5">
      <div class="content-wrapper mt-4">
        <h3 class="text-center">Publications scientifiques liées à la plateforme</h3>
        <div class="jumbotron p-4">
          <ul class="list-unstyled">
            <li>
              <i>
                <a href="https://hal.science/hal-04681804v1" target="_blank">Database Approaches to the Modelling and Querying of Musical Scores: a Survey.</a>
              </i>
              <br>
              <span class="text-muted">Adel Aly, Olivier Pivert, Virginie Thion - Proceedings of the Intl. Conf. on Theory and Practice of Digital Libraries (TPDL'24)</span>
            </li>
            <li>
              <i>
                <a href="https://www.sciencedirect.com/science/article/pii/S0169023X24000648" target="_blank">Topological querying of music scores.</a>
              </i>
              <br>
              <span class="text-muted">Philippe Rigaux, Virginie Thion - Data Knowl. Eng. journal. 153: 102340 (2024)</span>
            </li>
            <li>
              <i>
                <a href="http://www.openscience.fr/Exploration-de-partitions-musicales-modelisees-sous-forme-de-graphe" target="_blank">Exploration de partitions musicales modélisées sous forme de graphe</a>
              </i>
              <br>
              <span class="text-muted">Philippe Rigaux, Virginie Thion - Revue Ouverte d'Ingénierie des systèmes d'information, 4(2), 2024</span>
            </li>
            <li>
              <i>
                Towards a Graph-Oriented Perspective for Querying Music Scores
              </i>
              <br>
              <span class="text-muted">Philippe Rigaux, Virginie Thion - Proceedings of the INFORSID conf.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReferencesView'
  };
  </script>
  
  <style scoped>
  .container {
    text-align: center;
  }
  
  .jumbotron {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .list-unstyled li {
    margin-bottom: 15px;
  }
  
  .list-unstyled a {
    font-weight: bold;
    text-decoration: none;
    color: #006485;
  }
  
  .list-unstyled a:hover {
    text-decoration: underline;
  }
  </style>