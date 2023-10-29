from flask import Blueprint, jsonify, request


def get_skill_by_id_route(Skills):
    get_skill_by_id_bp = Blueprint("get_skill_by_id", __name__)

    @get_skill_by_id_bp.route("/api/get_skill_by_id", methods=["POST"])
    def get_skill_by_id():
        """
        Get a skill by id.

        Returns:
            A JSON object containing the skill information.
        """
        try:
            if request.method == "POST":
                data = request.get_json()
                id = data.get("skill_id")

                if not id:
                    return jsonify({"message": "Missing 'id' in JSON data"}), 400

                skill = Skills.query.filter_by(id=id).first()
                if not skill:
                    return jsonify({"message": "skill not found"}), 404

                return jsonify({"skill": skill.to_dict()}), 200

        except Exception as e:
            jsonify({"message": f"Error getting skill info: {e}"}), 500

        return jsonify({"skill": []})

    return get_skill_by_id_bp
