CALL apoc.cypher.runFiles([
'/Users/alex/Desktop/BTS_SIO_24_25/ProjetStage/SKRIDPlatform/assets/data/Albert-Poulain/load_DB.cql', 
'/Users/alex/Desktop/BTS_SIO_24_25/ProjetStage/SKRIDPlatform/assets/data/Francois-Marie-Luzel/load_DB.cql', 
'/Users/alex/Desktop/BTS_SIO_24_25/ProjetStage/SKRIDPlatform/assets/data/Joseph-Mahe-Original/load_DB.cql', 
'/Users/alex/Desktop/BTS_SIO_24_25/ProjetStage/SKRIDPlatform/assets/data/Joseph-Mahe-TransposedG/load_DB.cql'
], {statistics: false});
