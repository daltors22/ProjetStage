from flask import Blueprint, request, jsonify
from database import driver  # Vérifie que le driver est bien importé

neo4j_routes = Blueprint("neo4j", __name__)  # 🔥 Définit bien le Blueprint AVANT les routes

@neo4j_routes.route("/query", methods=["POST"])
def execute_query():
    query = request.json.get("query", "")
    if any(kw in query.lower() for kw in ["create", "delete", "set", "remove", "detach", "load"]):
        return jsonify({"error": "Operation not allowed."}), 403
    try:
        with driver.session() as session:
            result = session.run(query)
            results = [record.values() for record in result]
        return jsonify({"results": results})
    except Exception as e:
        print(f"Erreur /query: {e}")
        return jsonify({"error": str(e)}), 500
