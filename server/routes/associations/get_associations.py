from flask import Blueprint, jsonify, request


def get_all_associations_route(Association):
    get_all_associations_bp = Blueprint("get_associations", __name__)

    @get_all_associations_bp.route("/api/get_all_associations", methods=["GET"])
    def get_all_associations():
        """
        Get all associations from the database.

        Returns:
            A JSON object containing all associations in the database.
        """
        try:
            if request.method == "GET":
                associations = Association.query.all()
                result = []

            for association in associations:
                result.append(association.to_dict())

            return jsonify({"associations": result}), 200
        except Exception as e:
            jsonify({"message": f"Error getting associations: {e}"}), 500

        return jsonify({"associations": []})

    return get_all_associations_bp
