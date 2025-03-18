# Create database

Download neo4j-desktop (keep the activation code and paste it when launching the application).

In the application, create a new project, and add a database (add button, then local DBMS). Choose a name (SKRID_db for example), and a password (at least 8 characters). Remember the password, it will be needed later (see Generate files). Then select the version 4.2.1.

When this is done, click on the name, then on the right click on Plugins. Install APOC.

Then click on ..., then Settings, and replace the configuration with the content of config/neo4j.conf.

Finally you can launch the database with the Start button. To test queries, you can use the Open button that will create a window with a query prompt.

# Technologies utilisées

Backend : Python (Flask, Neo4j)
Frontend : Vue.js (Vite)
Base de données : Neo4j
Dépendances principales :
Backend : Flask, Flask-CORS, Neo4j
Frontend : Vue 3, Vite

## Structure du projet

```
SKRIDFRAMEWORK/
│── backend/              # API Flask pour gérer les collections de partitions
│   ├── api.py            # Point d'entrée du backend Flask
│   ├── database.py       # Gestion des bases de données
│   ├── neo4j_db.py       # Connexion à Neo4j
│   ├── routes/           # Routes API Flask
│   ├── data/             # Dossier des fichiers de partitions (non inclus dans le repo pour l'instant)
│   ├── requirements.txt  # Dépendances Python
│   ├── venv/             # Environnement virtuel (exclu du repo)
│── frontend/             # Application Vue.js pour l'interface utilisateur
│   ├── public/           # Ressources statiques
│   ├── src/              # Code source Vue.js
│   ├── package.json      # Dépendances du frontend
│   ├── vite.config.js    # Configuration de Vite
│── README.md             # Documentation du projet
│── .gitignore            # Fichiers à exclure du versionnement
```

### Installation et Configuration

```
git clone https://github.com/daltors22/SKRIDFRAMEWORK.git
cd SKRIDFRAMEWORK
```

### Installation du backend
Pré-requis : Python 3.10+ et pip / pip3

```
cd backend
python3.10 -m venv venv          # Créer un environnement virtuel
source venv/bin/activate      # (Mac/Linux) Activer l'environnement
# Pour Windows : venv\Scripts\activate

pip install -r requirements.txt  # Installer les dépendances
```

Test - lancer le serveur Flask - port :5000

```
python api.py
```

### Installation du frontend
Pré-requis : Node et npm

```
cd frontend
npm install    # Installer les dépendances
```
Test - lancer l'application Vue.js - port :5173

```
npm run dev
```