from flask import Blueprint, jsonify, request
from flask_login import current_user


def check_authentication_route():
    check_auth_bp = Blueprint("check_auth_route", __name__)

    @check_auth_bp.route("/api/check_authentication", methods=["GET"])
    def check_authentication():
        """
        Check if the user is authenticated.

        Returns:
            str: JSON response indicating whether the user is authenticated.
        """
        if request.method == "GET":
            print("current_user.is_authenticated", current_user.is_authenticated)
            if current_user.is_authenticated:
                return jsonify({"authenticated": True})
            else:
                return jsonify({"authenticated": False})
        
        return jsonify({"authenticated": False})

    return check_auth_bp
