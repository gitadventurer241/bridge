from flask import Blueprint, jsonify, request

home_bp = Blueprint("homepage", __name__)

@home_bp.route("/", methods=["GET"])
def homepage():
    if request.method == "GET":
        return jsonify({"message": "Welcome to the shift4 server!"})
