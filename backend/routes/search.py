from flask import Blueprint, request, jsonify
from database import driver  # Import du driver Neo4j
import os

search_routes = Blueprint("search", __name__)  # 🔥 Correction du nom du Blueprint

@search_routes.route("/", methods=["GET"])
def search():
    query_text = request.args.get("query", "")
    results = []
    try:
        search_query = "MATCH (s:Score) WHERE s.source CONTAINS $query RETURN s ORDER BY s.source DESC"
        with driver.session() as session:
            result = session.run(search_query, query=query_text)
            results = [record["s"] for record in result]
    except Exception as e:
        print(f"Erreur /search: {e}")
    return jsonify({"results": results})
