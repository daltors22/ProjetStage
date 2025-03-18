from flask import Blueprint, send_from_directory, abort
import os

files_routes = Blueprint("files", __name__)

# 📂 Servir les fichiers statiques depuis `/backend/data/`
@files_routes.route("/data/<author>/<subfolder>/<filename>", methods=["GET"])
def serve_file(author, subfolder, filename):
    
    """ 📌 Servir un fichier SVG ou MEI depuis /backend/data/author/svg/ """
    data_folder = os.path.join(os.getcwd(), "data", author, subfolder)
    file_path = os.path.join(data_folder, filename)

    print(f"🔍 Requête pour {file_path}")

    if not os.path.exists(file_path):
        print(f"❌ Fichier introuvable : {file_path}")
        return abort(404)

    print(f"✅ Fichier trouvé, envoi : {file_path}")
    return send_from_directory(data_folder, filename)
