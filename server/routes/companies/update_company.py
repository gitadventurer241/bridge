from flask import Blueprint, jsonify, request


def update_company_route(Company, db):
    update_company_bp = Blueprint("update_company", __name__)

    @update_company_bp.route("/api/update_company", methods=["PUT"])
    def update_company():
        try:
            if request.method == "PUT":
                data = request.get_json()
                id = data.get("user_id")

                company = Company.query.filter_by(user_id=id).first()

                if not company:
                    return jsonify({"message": "company not found"}), 404

                # Update the company's fields based on the data provided
                company_dict = company.to_dict()
                for key, _ in company_dict.items():
                    if key in data:
                        setattr(company, key, data[key])

                db.session.commit()

                return jsonify({"message": "company updated successfully"}), 200

        except Exception as e:
            return jsonify({"message": f"Error updating company: {e}"}), 500

        return jsonify({"message": "Invalid request"}), 400

    return update_company_bp
