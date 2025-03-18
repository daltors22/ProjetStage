from flask import Blueprint, request, jsonify
import subprocess

script_routes = Blueprint("scripts", __name__)  # Définition correcte du Blueprint

@script_routes.route("/compileFuzzy", methods=["POST"])
def compile_fuzzy():
    print("✅ /scripts/compileFuzzy a bien reçu une requête")  # LOG
    query = request.json.get("query", "")
    try:
        result = subprocess.run(["python3", "compilation_requete_fuzzy/main_parser.py", "compile", query],
                                capture_output=True, text=True)
        return jsonify({"results": result.stdout})
    except Exception as e:
        return jsonify({"error": str(e)})
