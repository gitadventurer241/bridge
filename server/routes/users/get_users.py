from flask import Blueprint, jsonify, request


def get_all_users_route(User):
    get_all_users_bp = Blueprint("get_users", __name__)

    @get_all_users_bp.route("/api/get_all_users", methods=["GET"])
    def get_all_users():
        """ """
        try:
            if request.method == "GET":
                users = User.query.all()
                result = []

            for user in users:
                result.append(user.to_dict())

            return jsonify({"users": result}), 200
        except Exception as e:
            jsonify({"message": f"Error getting users: {e}"}), 500

        return jsonify({"users": []})

    return get_all_users_bp
