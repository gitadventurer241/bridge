from flask import Blueprint, jsonify, request


def get_job_by_id_route(Jobs):
    get_job_by_id_bp = Blueprint("get_job_by_id", __name__)

    @get_job_by_id_bp.route("/api/get_job_by_id", methods=["POST"])
    def get_job_by_id():
        """
        Get a job by id.

        Returns:
            A JSON object containing the job data.
        """
        try:
            if request.method == "POST":
                data = request.get_json()
                id = data.get("job_id")

                if not id:
                    return jsonify({"message": "Missing 'id' in JSON data"}), 400

                job = Jobs.query.filter_by(id=id).first()
                if not job:
                    return jsonify({"message": "job not found"}), 404

                return jsonify({"jobs": job.to_dict()}), 200

        except Exception as e:
            jsonify({"message": f"Error getting job data: {e}"}), 500

        return jsonify({"job": []})

    return get_job_by_id_bp
