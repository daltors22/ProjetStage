# database.py
from neo4j import GraphDatabase
import os

NEO4J_URI = "bolt://10.211.55.4:7687"
NEO4J_USER = "neo4j"
PASSWORD_FILE = ".database_password"

try:
    with open(PASSWORD_FILE, "r") as f:
        NEO4J_PASSWORD = f.read().strip()
except Exception as e:
    print(f"Erreur de lecture du fichier {PASSWORD_FILE}: {e}")
    NEO4J_PASSWORD = "12345678"

# Initialisation du driver Neo4j
driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def get_db():
    """ Retourne une session Neo4j """
    return driver.session()

def close_db():
    """ Ferme la connexion proprement """
    driver.close()
