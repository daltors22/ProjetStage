//============= Imports =============//
import { loadPageN } from './paginated_results.js';
import { unifyResults, extractMelodyFromQuery } from './preview_scores.js';

//============= Initialisation au DOMContentLoaded =============//
document.addEventListener("DOMContentLoaded", initMicro);

//============= Variables globales =============//
// BASE_PATH doit être défini (par exemple, via une variable globale ou importé depuis un autre module)
const BASE_PATH = window.BASE_PATH || ''; // ajustez si nécessaire

//============= Fonctions =============//

/**
 * Initialise l'interface micro.
 */
// micro_interface.js

import { startAubioMicrophone, stopAubioMicrophone } from './aubio_microphone.js';

document.addEventListener("DOMContentLoaded", initMicro);

function initMicro() {
  const micForm = document.getElementById("microphone-form");
  if(micForm) {
    micForm.addEventListener("submit", handleMicSubmit);
  }
  
  const startBtn = document.getElementById('start-mic');
  const stopBtn = document.getElementById('stop-mic');
  if(startBtn) {
    startBtn.addEventListener('click', () => {
      startAubioMicrophone();
    });
  }
  if(stopBtn) {
    stopBtn.addEventListener('click', () => {
      const notes = stopAubioMicrophone();
      // Par exemple, mettez à jour le champ caché avec un format approprié pour le back-end.
      // Vous pouvez adapter le format selon ce que votre parser Python attend.
      document.getElementById('notes-input').value = '[' + detectedNotes.join(', ') + ']';
      document.getElementById('detected-notes').textContent = JSON.stringify(notes);
    });
  }
}

// Reste de votre code existant pour le formulaire, etc.


/**
 * Gère la soumission du formulaire pour le micro.
 * Envoie les données (notes et options) à /formulateQueryFromMicrophone,
 * puis, si la réponse est correcte, envoie le fuzzy query à /queryFuzzy
 * pour mettre à jour l'affichage dans .container_2.
 */
function handleMicSubmit(e) {
    e.preventDefault();
  
    // Au lieu de modifier l'ensemble de .container_2,
    // on affiche le message de chargement dans l'élément dédié aux résultats.
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "<h3>Chargement...</h3>";
  
    // Récupère les données du formulaire
    const formData = new FormData(e.target);
    let dataObj = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });
    console.log(dataObj);
    fetch(`${BASE_PATH}/formulateQueryFromMicrophone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataObj)
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          alert(json.error);
          // Vous pouvez réinitialiser le contenu de results-container
          resultsContainer.innerHTML = "";
        } else {
          // json.query contient le fuzzy query généré par le script Python
          let fuzzyQuery = json.query;
          sendQuery(fuzzyQuery);
        }
      })
      .catch(err => {
        console.error("Erreur lors de la requête micro:", err);
      });
  }
  

/**
 * Envoie le fuzzyQuery à l'endpoint /queryFuzzy et met à jour l'affichage.
 *
 * @param {string} fuzzyQuery - La requête floue générée par le script Python.
 */
function sendQuery(fuzzyQuery) {
    console.log('Sending query:\n', fuzzyQuery);
  
    fetch(`${BASE_PATH}/queryFuzzy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: fuzzyQuery, format: 'json' })
    })
      .then(response => response.json())
      .then(data => {
        // Assurez-vous que les éléments existent
        const container2 = document.querySelector('.container_2');
        let dataElem = document.getElementById('data');
        let patternElem = document.getElementById('pattern');
        if (!dataElem) {
          dataElem = document.createElement('div');
          dataElem.id = 'data';
          dataElem.style.display = 'none';
          container2.appendChild(dataElem);
        }
        if (!patternElem) {
          patternElem = document.createElement('div');
          patternElem.id = 'pattern';
          patternElem.style.display = 'none';
          container2.appendChild(patternElem);
        }
  
        console.log("Réponse /queryFuzzy:", data);
        if ('results' in data) {
          try {
            const unified = unifyResults({ results: JSON.parse(data.results) });
            console.log("Résultats unifiés :", unified);
            dataElem.textContent = JSON.stringify(unified);
            patternElem.textContent = extractMelodyFromQuery(fuzzyQuery);
            console.log("Content of #data:", dataElem.textContent);
            console.log("Parsed page data:", getPageData());
            loadPageN(1, null, true, true, true);
          } catch (e) {
            console.error("Erreur lors du parsing des résultats :", e);
            dataElem.textContent = '[]';
            patternElem.textContent = '';
            loadPageN(1, null, true, true);
          }
        } else if ('error' in data) {
          dataElem.textContent = '[]';
          patternElem.textContent = '';
          loadPageN(1, null, true, true);
          console.error(data.error);
          alert(data.error);
        }
      })
      .catch(err => {
        console.error('Error:', err);
      });
  }
  
  

function getPageData() {
    return JSON.parse(document.getElementById('data').textContent);
}

  
