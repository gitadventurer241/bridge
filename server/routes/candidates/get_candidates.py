from flask import Blueprint, jsonify, request


def get_all_candidates_route(Candidate):
    get_all_candidates_bp = Blueprint("get_candidates", __name__)

    @get_all_candidates_bp.route("/api/get_all_candidates", methods=["GET"])
    def get_all_candidates():
        """ """
        try:
            if request.method == "GET":
                candidates = Candidate.query.all()
                result = []

            for candidate in candidates:
                candidate_data = candidate.to_dict()
                result.append(candidate_data)

            return jsonify({"candidates": result}), 200
        except Exception as e:
            jsonify({"message": f"Error getting candidates: {e}"}), 500

        return jsonify({"candidates": []})

    return get_all_candidates_bp
