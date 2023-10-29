from flask import Blueprint, jsonify, request


def update_job_route(Job, db):
    update_job_bp = Blueprint("update_job", __name__)

    @update_job_bp.route("/api/update_job", methods=["PUT"])
    def update_job():
        try:
            if request.method == "PUT":
                data = request.get_json()
                id = data.get("job_id")
                
                job = Job.query.filter_by(id=id).first()

                if not job:
                    return jsonify({"message": "job not found"}), 404

                # Update the job's fields based on the data provided
                job_dict = job.to_dict()
                for key, _ in job_dict.items():
                    if key in data:
                        setattr(job, key, data[key])

                db.session.commit()

                return jsonify({"message": "job updated successfully"}), 200

        except Exception as e:
            return jsonify({"message": f"Error updating job: {e}"}), 500

        return jsonify({"message": "Invalid request"}), 400

    return update_job_bp
