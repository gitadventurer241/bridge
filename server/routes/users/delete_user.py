from flask import Blueprint, jsonify, request
import uuid
from sqlalchemy.dialects.postgresql import UUID


def delete_user_route(User, Candidate, Company, Admin, Association, db):
    delete_user_bp = Blueprint("delete_user", __name__)

    @delete_user_bp.route("/api/delete_user", methods=["POST"])
    # @login_required
    def delete_user():
        """
        Delete the user matching the given user_id.

        Returns:
            str: JSON response indicating successful user deletion.
        """
        if request.method == "POST":
            data = request.get_json()
            id = data.get("user_id")

            user = User.query.filter_by(id=id).first()

            if user:
                # Determine user_type and delete the corresponding record
                if user.user_type == "candidate":
                    candidate = Candidate.query.filter_by(user_id=user.id).first()
                    if candidate:
                        db.session.delete(candidate)
                elif user.user_type == "company":
                    company = Company.query.filter_by(user_id=user.id).first()
                    if company:
                        db.session.delete(company)
                elif user.user_type == "admin":
                    admin = Admin.query.filter_by(user_id=user.id).first()
                    if admin:
                        db.session.delete(admin)
                elif user.user_type == "association":
                    association = Association.query.filter_by(
                        user_id=user.id
                    ).first()
                    if association:
                        db.session.delete(association)

                db.session.delete(user)
                db.session.commit()
                # logout_user()
                return jsonify({"message": "User deleted successfully"}), 200

            return jsonify({"message": "User not found"}), 404
        return jsonify({"message": "Not POST method"}), 403

    return delete_user_bp
