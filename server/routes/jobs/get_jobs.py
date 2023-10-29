from flask import Blueprint, jsonify, request


def get_all_jobs_route(Jobs):
    get_all_jobs_bp = Blueprint("get_jobs", __name__)

    @get_all_jobs_bp.route("/api/get_all_jobs", methods=["GET"])
    def get_all_jobs():
        """
        Get all jobs from the database.

        Returns:
            A JSON object containing all jobs in the database.
        """
        try:
            if request.method == "GET":
                jobs = Jobs.query.all()
                result = []
                for job in jobs:
                    
                    result.append(job.to_dict())
                    
            return jsonify({"jobs": result}), 200
        except Exception as e:
            jsonify({"message": f"Error getting jobs: {e}"}), 500

        return jsonify({"jobs": []})

    return get_all_jobs_bp
