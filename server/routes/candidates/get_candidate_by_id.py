from flask import Blueprint, jsonify, request


def get_candidate_by_id_route(Candidate):
    get_candidate_by_id_bp = Blueprint("get_candidate_by_id", __name__)

    @get_candidate_by_id_bp.route("/api/get_candidate_by_id", methods=["POST"])
    def get_candidate_by_id():
        try:
            if request.method == "POST":
                data = request.get_json()
                id = data.get("user_id")

                if not id:
                    return jsonify({"message": "Missing 'id' in JSON data"}), 400

                candidate = Candidate.query.filter_by(user_id=id).first()

                if not candidate:
                    return jsonify({"message": "Candidate not found"}), 404
                
                return jsonify({"candidates": candidate.to_dict()}), 200

        except Exception as e:
            jsonify({"message": f"Error getting candidate data: {e}"}), 500
            return jsonify({"message": f"Internal Server Error"}), 500

        return jsonify({"candidate": {"message": "Candidate not found"}}), 404

    return get_candidate_by_id_bp
