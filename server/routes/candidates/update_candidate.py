from flask import Blueprint, jsonify, request


def update_candidate_route(Candidate, db):
    update_candidate_bp = Blueprint("update_candidate", __name__)

    @update_candidate_bp.route("/api/update_candidate", methods=["PUT"])
    def update_candidate():
        """
        Update the candidate matching the given user_id. The request body must
        contain a JSON object with the fields to be updated.

        Returns:
            str: JSON response indicating successful candidate update.
        """
        try:
            if request.method == "PUT":
                data = request.get_json()
                id = data.get("user_id")

                candidate = Candidate.query.filter_by(user_id=id).first()

                if not candidate:
                    return jsonify({"message": "Candidate not found"}), 404

                # Update the candidate's fields based on the data provided
                candidate_dict = candidate.to_dict()
                for key, _ in candidate_dict.items():
                    if key in data:
                        setattr(candidate, key, data[key])

                db.session.commit()
          
                return jsonify({"message": "Candidate updated successfully"}), 200

        except Exception as e:
            return jsonify({"message": f"Error updating candidate: {e}"}), 500

        return jsonify({"message": "Invalid request"}), 400

    return update_candidate_bp
