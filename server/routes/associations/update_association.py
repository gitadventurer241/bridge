from flask import Blueprint, jsonify, request


def update_association_route(Association, db):
    update_association_bp = Blueprint("update_association", __name__)

    @update_association_bp.route("/api/update_association", methods=["PUT"])
    def update_association():
        try:
            if request.method == "PUT":
                data = request.get_json()
                id = data.get("user_id")

                association = Association.query.filter_by(user_id=id).first()

                if not association:
                    return jsonify({"message": "association not found"}), 404

                # Update the association's fields based on the data provided
                association_dict = association.to_dict()
                for key, _ in association_dict.items():
                    if key in data:
                        setattr(association, key, data[key])

                db.session.commit()

                return jsonify({"message": "association updated successfully"}), 200

        except Exception as e:
            return jsonify({"message": f"Error updating association: {e}"}), 500

        return jsonify({"message": "Invalid request"}), 400

    return update_association_bp
