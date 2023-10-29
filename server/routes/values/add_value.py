from flask import Blueprint, jsonify, request


def add_value_route(Values, db):
    add_value_bp = Blueprint("add_value", __name__)

    @add_value_bp.route("/api/add_value", methods=["POST"])
    def add_value():
        """ """
        if request.method == "POST":
            data = request.get_json()
            name = data.get("name")

            new_value = Values(
                name=name,
            )

            db.session.add(new_value)
            db.session.commit()

            return jsonify({"message": "Value added successfully"})

    return add_value_bp
