import bcrypt
from flask import Blueprint, jsonify, request
from flask_login import login_user

def register_route(User, Candidate, Company, Association, Admin, db):
    register_bp = Blueprint("register", __name__)

    @register_bp.route("/api/register", methods=["POST"])
    def register():
        """
        Register a new user.

        This route handles user registration by accepting a POST request with JSON data.
        It validates the data and saves the user information in the appropriate table
        based on the provided user_type.

        Parameters (POST JSON data):
            - password (str): The password for the new user (will be hashed).
            - email (str): The email address of the new user.
            - user_type (str): The type of user (e.g., "candidate" or "company").
            - associations (str): The associations of the new user.
            - association_name (str): The association name of the new user.

        Returns:
            - 200 OK: If the registration is successful.
            - 400 Bad Request: If the user_type is invalid.
        """
        if request.method == "POST":
            data = request.get_json()
            password = data.get("password")
            email = data.get("email")
            user_type = data.get("user_type")  # Get user type from the request
            try:
                # Hash the password before saving it to the appropriate table
                hashed_password = bcrypt.hashpw(
                    password.encode("utf-8"), bcrypt.gensalt()
                )
                hashed_password = hashed_password.decode("utf-8")

                # Save the new user in the "user" table
                new_user = User(
                    password=hashed_password,
                    email=email,
                    user_type=user_type,
                )
                db.session.add(new_user)
                db.session.commit()

                user_id = new_user.id

                # Create a new user and save it to the appropriate table
                if user_type == "candidate":
                    first_name = data.get("first_name")
                    last_name = data.get("last_name")
                    associations = data.get("associations")
                    preferred_title = data.get("preferred_title")
                    # Save the user also in the "candidate" table
                    new_candidate = Candidate(
                        user_id=user_id,
                        password=hashed_password,
                        first_name=first_name,
                        last_name=last_name,
                        preferred_title=preferred_title,
                        email=email,
                        associations=associations,
                    )
                    db.session.add(new_candidate)
                    db.session.commit()

                elif user_type == "company":
                    company_name = data.get("company_name")
                    associations = data.get("associations")
                    # Save the user also in the "company" table
                    new_company = Company(
                        user_id=user_id,
                        password=hashed_password,
                        email=email,
                        company_name=company_name,
                        associations=associations,
                    )
                    db.session.add(new_company)
                    db.session.commit()

                elif user_type == "association":
                    association_name = data.get("association_name")
                    # Save the user also in the "association" table
                    new_association = Association(
                        user_id=user_id,
                        password=hashed_password,
                        email=email,
                        association_name=association_name,
                    )
                    db.session.add(new_association)
                    db.session.commit()

                elif user_type == "admin":
                    admin_name = data.get("admin_name")
                    # Save the user also in the "admin" table
                    new_admin = Admin(
                        user_id=user_id,
                        password=hashed_password,
                        email=email,
                        admin_name=admin_name,
                    )
                    db.session.add(new_admin)
                    db.session.commit()
                else:
                    return jsonify({"message": "Invalid user type"}), 400

                login_user(new_user)
                return jsonify(
                    {"message": "User registered successfully", "user_type": user_type}
                )
            except Exception as e:
                return jsonify({"message": "Error registering user {e}"}), 500

    return register_bp
