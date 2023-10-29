from flask import Blueprint, jsonify, request
import uuid
from sqlalchemy.dialects.postgresql import UUID


def delete_job_route(Job, db):
    delete_job_bp = Blueprint("delete_job", __name__)

    @delete_job_bp.route("/api/delete_job", methods=["POST"])
    # @login_required
    def delete_job():
        """
        Delete the job matching the given job_id.

        Returns:
            str: JSON response indicating successful job deletion.
        """
        if request.method == "POST":
            data = request.get_json()
            id = data.get("job_id")

            job = Job.query.filter_by(id=id).first()

            if job:
                db.session.delete(job)
                db.session.commit()

                return jsonify({"message": "job deleted successfully"})

            return jsonify({"message": "job not found"}), 404
        return jsonify({"message": "Not POST method"}), 403

    return delete_job_bp
