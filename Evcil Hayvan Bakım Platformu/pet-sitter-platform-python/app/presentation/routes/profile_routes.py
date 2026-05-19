"""
Profil blueprint - gecici stub (auth redirect hedefleri).
"""

from flask import Blueprint

profile_bp = Blueprint("profile", __name__, url_prefix="/profile")


@profile_bp.route("/create", methods=["GET"])
def create_profile():
    """Bakici profil olusturma - yakinda gelistirilecek."""
    return "Profil olusturma (yakinda).", 200


@profile_bp.route("/", methods=["GET"])
def view_profile():
    """Bakici profil goruntuleme - yakinda gelistirilecek."""
    return "Profil (yakinda).", 200
