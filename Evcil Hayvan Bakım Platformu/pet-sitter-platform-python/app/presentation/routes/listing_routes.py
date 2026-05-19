"""
Liste blueprint - gecici stub (auth redirect hedefleri).
"""

from flask import Blueprint

listing_bp = Blueprint("listing", __name__, url_prefix="/listings")


@listing_bp.route("/sitters", methods=["GET"])
def list_sitters():
    """Bakici listesi - yakinda gelistirilecek."""
    return "Bakici listesi (yakinda).", 200
