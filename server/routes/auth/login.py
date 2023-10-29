import bcrypt
from datetime import timedelta
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user


def login_route(User):
    login_bp = Blueprint("login", __name__)

    @login_bp.route("/api/login", methods=["GET", "POST"])
    def login():
        """
        Authenticate and log in a user.

        This route handles user authentication and login by accepting a POST request with
        JSON data containing the email and password. It verifies the provided
        credentials, and if they are correct, marks the user as authenticated using the
        `login_user` function.

        Parameters (POST JSON data):
            - email (str): The email of the user trying to log in.
            - password (str): The password provided by the user.

        Returns:
            - 200 OK: If the login is successful.
            - 400 Bad Request: If either the email or password is missing.
            - 401 Unauthorized: If the provided email is not registered or if the
            password is incorrect.

        Note:
            - The route uses the `bcrypt` library to securely verify the password.
            - After a successful login, the user is marked as authenticated with `login_user()`,
            and they can access protected resources.
        """
        if request.method == "POST":
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return jsonify({"message": "email and password are required"}), 400
            # Retrieve the user from the database based on the provided email
            user = User.query.filter_by(email=email).first()

            if user:
                # Verify the password using passlib
                if bcrypt.checkpw(
                    password.encode("utf-8"), user.password.encode("utf-8")
                ):
                    # If the password is valid, mark the user as authenticated
                    is_logged = login_user(
                        user, force=True, remember=True, duration=timedelta(days=1)
                    )
                    if is_logged:
                        return (
                            jsonify(
                                {"message": "Login successful", "user": user.to_dict()}
                            ),
                            200,
                        )
                    else:
                        return (
                            jsonify(
                                {
                                    "message": "Login unsuccessful",
                                    "user": user.to_dict(),
                                }
                            ),
                            417,
                        )
                else:
                    return jsonify({"message": "Invalid email or password"}), 401
            else:
                return jsonify({"message": "User is not registered"}), 403

        if request.method == "GET":
            if current_user.is_authenticated:
                return jsonify({"message": "Logged in"}), 200
            else:
                return jsonify({"message": "Not logged in"}), 200

        return jsonify({"message": "Method Not Allowed"}), 405

    return login_bp
