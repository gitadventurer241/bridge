from flask import Blueprint, jsonify, request


def get_association_by_id_route(Association):
    get_association_by_id_bp = Blueprint("get_association_by_id", __name__)

    @get_association_by_id_bp.route("/api/get_association_by_id", methods=["POST"])
    def get_association_by_id():
        try:
            if request.method == "POST":
                data = request.get_json()
                id = data.get("user_id")

                if not id:
                    return jsonify({"message": "Missing 'id' in JSON data"}), 400

                association = Association.query.filter_by(user_id=id).first()

                if not association:
                    return jsonify({"message": "association not found"}), 404

                return jsonify({"associations": association.to_dict()}), 200

        except Exception as e:
            jsonify({"message": f"Error getting association data: {e}"}), 500

        return jsonify({"association": []})

    return get_association_by_id_bp
