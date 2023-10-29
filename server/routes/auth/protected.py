from flask import Blueprint, jsonify
from flask_login import current_user, login_required

protected_bp = Blueprint("protected", __name__)


@protected_bp.route("/api/protected")
@login_required
def protected():
    """
    A protected route that requires authentication.

    Returns:
        str: JSON response with a welcome message for the authenticated user.
    """
    return jsonify(
        {"message": f"Hello, {current_user.email}! This is a protected route."}
    )
