from flask import Blueprint, jsonify, request
import bcrypt

def change_password_route(User, db):
    change_password_bp = Blueprint("change_password", __name__)

    @change_password_bp.route("/api/change_password", methods=["POST"])
    def change_password():
        """
        Change the user's password.

        This route handles changing the user's password by accepting a POST request with JSON data.
        It validates the data and compares the input password with the one saved in the database.

        Parameters (POST JSON data):
            - user_id (int): The user's ID.
            - current_password (str): The current password of the user.
            - new_password (str): The new password for the user.

        Returns:
            - 200 OK: If the password change is successful.
            - 400 Bad Request: If the current_password is incorrect or user_id is invalid.
        """
        if request.method == "POST":
            data = request.get_json()
            user_id = data.get("user_id")
            current_password = data.get("current_password")
            new_password = data.get("new_password")

            # Fetch the user from the database by user_id
            user = User.query.get(user_id)

            if user is None:
                return jsonify({"message": "User not found"}), 404

            # Verify the current password
            if bcrypt.checkpw(
                current_password.encode("utf-8"), user.password.encode("utf-8")
            ):
                # Hash the new password before saving it
                hashed_new_password = bcrypt.hashpw(
                    new_password.encode("utf-8"), bcrypt.gensalt()
                )
                hashed_new_password = hashed_new_password.decode("utf-8")
               
                # Update the user's password in the database
                user.password = hashed_new_password
                db.session.commit()

                return jsonify({"message": "Password changed successfully"}), 200
            else:
                return jsonify({"message": "Incorrect current password"}), 400

    return change_password_bp
