from flask import Blueprint, jsonify, request


def get_company_by_id_route(Company):
    get_company_by_id_bp = Blueprint("get_company_by_id", __name__)

    @get_company_by_id_bp.route("/api/get_company_by_id", methods=["POST"])
    def get_company_by_id():
        try:
            if request.method == "POST":
                data = request.get_json()
                id = data.get("user_id")

                if not id:
                    return jsonify({"message": "Missing 'id' in JSON data"}), 400

                company = Company.query.filter_by(user_id=id).first()
                if not company:
                    return jsonify({"message": "company not found"}), 404

                return jsonify({"companies": company.to_dict()}), 200

        except Exception as e:
            jsonify({"message": f"Error getting company data: {e}"}), 500

        return jsonify({"company": []})

    return get_company_by_id_bp
