<template>
    <div v-if="showSearchbar" :class="['searchbar-box', { 'fade-out': fadingOut }]" class="searchbar-box text-center" @animationend="hideSearchbar">
        <h1 class="searchbar-title">Comment ça marche ?</h1>
    </div>
    <div class="container mt-5">
      <div class="content-wrapper mt-4">
        <h2 class="text-center">L'architecture logicielle</h2>
        <p class="text-justify">
          L'outil de recherche de motif musical de la plateforme SKRID s'appuie sur la modélisation intermédiaire d'une partition musicale sous la forme d'un graphe.
          Les représentations intermédiaires des partitions des collections mises à disposition sur la plateforme sont stockées dans une base de données graphe,
          gérée par un système de gestion dédié à ce type de base de données.
        </p>
        <p class="text-justify">
          L'interface "clavier de piano" permet à un utilisateur de définir un motif musical à rechercher. Un module spécifique de la couche fonctionnelle de la
          plateforme capture le motif musical, et le traduit en une requête (dite "à base de motif de graphe"). Cette requête est envoyée au système de gestion de base
          de données, qui l'exécute sur la base de données contenant les représentations intermédiaires des partitions et fournit en résultat les occurrences du motif
          trouvées au sein de la base de données. Ces résultats sont récupérés par la couche fonctionnelle de la plateforme SKRID, dont un module de visualisation
          restitue les résultats sous forme graphique.
        </p>
        <p class="text-center">
          Pour en savoir plus concernant le modèle de données intermédiaire utilisé et le mécanisme d'interrogation des données, vous pouvez consulter les articles de
          recherche mentionnés dans la section <a href="/references">Références et liens</a> du site.
        </p>
        
        <div class="jumbotron p-4 mt-5">
          <h2 class="text-center">Les contributeurs</h2>
          <p class="text-center">Ont contribué à la mise en œuvre de la plateforme (par ordre alphabétique) :</p>
          <hr>
          <ul>
            <li><strong>Adel Aly</strong> (poursuite du dev. de l'interface utilisateur et back-end)</li>
            <li><strong>Pierre Alain</strong> (mise en œuvre de l'architecture)</li>
            <li><strong>Vincent Barreaud</strong> (dev. de l'interface utilisateur et back-end)</li>
            <li><strong>Anne-Marie Nicol</strong> (amorce projet, références collections et contacts musique traditionnelle)</li>
            <li><strong>Tommaso Padovano</strong> (dev. de l'interface utilisateur et back-end)</li>
            <li><strong>Gwenaël Piel</strong> (encodage des collections J. Mahé)</li>
            <li><strong>Virginie Thion</strong> (génération des formats de données, dev. base de données)</li>
            <li><strong>Louis Thomas-Girardey</strong> (poursuite du dev. de l'interface utilisateur, back-end et outils de conversions de données)</li>
            <li><strong>Clément Van Straaten</strong> (outils de conversion de données)</li>
          </ul>
          <hr>
          <p class="text-center">
            Merci à l'IRISA et à L'Université de Rennes pour le financement de la plateforme (défi scientifique SKRID). Merci à l'ENSSAT pour la gestion du serveur
            hébergeant la plateforme.
          </p>
        </div>
        
        <h2 class="text-center mt-5">Contact</h2>
        <p class="text-center">Pour nous contacter, vous pouvez envoyer un message à Virginie Thion (prenom.nom@irisa.fr)</p>
        <br>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PlusView',
    data() {
    return {
      showSearchbar: true,
      fadingOut: false
    };
    },
    mounted() {
        setTimeout(() => {
        this.fadingOut = true;
        setTimeout(() => {
            this.showSearchbar = false;
        }, 1500); // Durée de la transition avant suppression
        }, 3000); // Temps d'affichage avant disparition
    }
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
  
  .text-justify {
    text-align: justify;
  }
  
  ul {
    list-style: none;
    padding: 0;
    width: 40%; /* Ajuste la largeur selon besoin */
    margin: 0 auto; /* Centre le bloc */
    text-align: left;
  }
  
  ul li {
    margin-bottom: 10px;
  }

  .searchbar-box {
    background-color: #006485;
    color: white;
    top: 0;
    padding: 10px;
    transition: opacity 1.5s ease-in-out;
    opacity: 1;
  }

  .fade-out {
    opacity: 0;
  }
  </style>