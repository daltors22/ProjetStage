<template>
    <div>
      <!-- Section principale -->
      <div class="searchbar-box text-center animate__animated animate__fadeInDown">
        <div class="container mb-5">
          <br>
          <h1>SKRID</h1>
          <p></p>
          <a href="#services" class="btn btn-outline btn-lg mt-3" style="background-color: #7ab6e0;">En savoir plus</a>
        </div>
      </div>
      <!-- Section des services -->
      <section id="services" class="services py-5">
        <div class="container">
          <h2 class="text-lest mb-4 text-center" style="color: #006485;">Le projet</h2>
          
          <p class="text-center text-muted mb-5">
            La plateforme Skrid est développée et maintenue par le laboratoire IRISA (site de Lannion). Cette plateforme est un prototype d&eacute;di&eacute; &agrave; 
            la mise en oeuvre de techniques de recherche de contenu musical (d&eacute;velopp&eacute;es par l'IRISA) au sein de partitions musicales de musique traditionnelle bretonne. <br> À ce jour, 
            deux collections sont int&eacute;gr&eacute;es &agrave; la plateforme Skrid. Une troisième collection est en cours de numérisation.
          </p>
          <hr>
          <br>
          <div class="row g-4">
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title text-center">Recueil Albert Poulain</h5>
                  <p class="card-text text-muted">
                    Ces partitions sont issues de l'ouvrage 
                    <a href="https://pur-editions.fr/product/668/carnets-de-route" target="_blank">
                    <i>Albert Poulain, Carnets de route, chansons traditionnelles de Haute Bretagne</i>
                    </a> 
                    (Éditions Dastum, Presses universitaires de Rennes), publié en 2011. Fichiers d'encodage. <br><br> 
                    Dastum (Anne-Marie Nicol) a fourni chacune des partitions disponibles au format d'un fichier Finale. 
                    <br><br> Le projet Skrid a exporté les partitions sous forme MusicXML (via la fonctionnalité d'export 
                    de Finale). Les partitions ont ensuite été exportée aux formats 
                    <a href="https://w3c.github.io/musicxml/" target="_blank">musicXML</a>
                    , PDF, MIDI, SVG via MuseScore. Le format 
                    <a href="https://music-encoding.org/" target="_blank">MEI</a> 
                    a été obtenu par transcription du fichier musicXML via l'outil 
                    <a href="https://www.verovio.org" target="_blank">verovio</a>. 
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title text-center">Avant-propos important</h5>
                  <p class="card-text text-muted"> 
                    L'objectif de la plateforme est la mise à disposition de partitions sous une forme numérisée permettant 
                    la recherche dans le contenu des partitions et non leur édition. <br><br> Le processus de conversion 
                    utilisé dans la plateforme, permettant de passer de la version originale de la partition à une version 
                    de la partition encodant son contenu musical de façon fine, peut conduire à la perte de quelques partitions 
                    d'une collection, à l'introduction de quelques erreurs et surtout à la perte de la mise en page des 
                    partitions. <br><br> Les fournisseurs des données que la plateforme remercie grandement pour leur aide, 
                    ne sont aucunement responsables des erreurs que le traitement des données pourrait occasionner sur les 
                    partitions mises à disposition par la plateforme. 
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title text-center">Recueil Joseph Mahé</h5>
                  <p class="card-text text-muted">
                    Origine des partitions. Ces partitions sont issues du manuscrit 
                    <a href="https://gallica.bnf.fr/ark:/12148/bpt6k61026071" target="_blank">
                    <i>Essai sur les Antiquit&eacute;s du d&eacute;partement du Morbihan</i>
                    </a>
                    , de Joseph Mahé, publié en 1825, dont une version numérique est mise à disposition dans la Biliothèque 
                    <a href="https://gallica.bnf.fr/" target="_blank">
                    Gallica
                    </a> 
                    de la BnF. <br><br> Ces œuvres sont également étudiées dans l'ouvrage Joseph Mahé (1760-1831) Premier 
                    collecteur de musique populaire de Haute et Basse-Bretagne de Roland Becker (Éditions Dastum, Presses 
                    universitaires de Rennes), publié en 2017. Fichiers d'encodage. Pour chacune des partitions, la partition 
                    a été saisie sous 
                    <a href="https://www.musescore.com" target="_blank">
                    MuseScore
                    </a>
                    (.mscz) par Gwenael Piel, et ensuite exportée aux formats 
                    <a href="https://w3c.github.io/musicxml/" target="_blank">
                    musicXML
                    </a>
                    , PDF, MIDI, SVG via MuseScore. <br><br> Le format 
                    <a href="https://music-encoding.org/" target="_blank">
                    MEI
                    </a> 
                    a été obtenu par transcription du fichier musicXML via l'outil 
                    <a href="https://www.verovio.org" target="_blank">
                    verovio.
                    </a>
                    Collections associées dans Skrid: Collection dite "Joseph Mahé Original" contenant les partitions originales
                    Collection dite "Joseph Mahé Transposed" contenant les partitions transposées dans la tonalité Sol Majeur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView'
  };
  </script>
  
  <style scoped>
  .hero {
    background: #006485;
    color: white;
    padding: 4rem 0;
    text-align: center;
  }
  
  .services .card {
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .services .card:hover {
    transform: translateY(-5px);
  }
  
  p {
    font-size: 14px;
  }
  </style>