from flask import Blueprint, jsonify, request


def get_all_companies_route(Company):
    get_all_companies_bp = Blueprint("get_companies", __name__)

    @get_all_companies_bp.route("/api/get_all_companies", methods=["GET"])
    def get_all_companies():
        """
        Get all companies from the database.

        Returns:
            A JSON object containing all companies in the database.
        """
        try:
            if request.method == "GET":
                companies = Company.query.all()
                result = []

            for company in companies:
                result.append(company.to_dict())

            return jsonify({"companies": result}), 200
        except Exception as e:
            jsonify({"message": f"Error getting companies: {e}"}), 500

        return jsonify({"companies": []})

    return get_all_companies_bp
