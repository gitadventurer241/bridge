import time
from flask import Blueprint, jsonify, request
from services.temporary_url import generate_temporary_link
from services.send_email import func_send_email

send_invite_bp = Blueprint("send_invite", __name__)


@send_invite_bp.route("/api/send_invite", methods=["POST"])
def send_invite():
    """
    Check if the user is authenticated.

    Returns:
        str: JSON response indicating whether the user is authenticated.
    """
    if request.method == "POST":
        data = request.get_json()
        user_type = data.get("user_type")
        recipient_email = data.get("recipient_email")
        association_name = data.get("association_name")

        # expiration_time = int(time.time()) + 24 * 60 * 60  # 24 hours in seconds
        response = func_send_email(recipient_email, user_type, association_name)

        if "success" in response["message"]:
            return jsonify({"success": 200, "link": response["link"]})
        return jsonify({"error": 400})
    else:
        return jsonify({"error": 400})
