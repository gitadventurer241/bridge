from flask import Blueprint, jsonify, request


def add_skill_route(Skills, db):
    add_skill_bp = Blueprint("add_skill", __name__)

    @add_skill_bp.route("/api/add_skill", methods=["POST"])
    def add_skill():
        """ """
        if request.method == "POST":
            data = request.get_json()
            name = data.get("name")
            category = data.get("category")

            new_skill = Skills(
                name=name,
                category=category,
            )

            db.session.add(new_skill)
            db.session.commit()

            return jsonify({"message": "skill added successfully"})

    return add_skill_bp
