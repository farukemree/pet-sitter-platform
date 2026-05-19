"""
Flask application factory.
"""

import os
from pathlib import Path

from flask import Flask

from app.presentation.routes.auth_routes import api_auth_bp, auth_bp
from app.presentation.routes.listing_routes import listing_bp
from app.presentation.routes.profile_routes import profile_bp


def create_app():
    base_dir = Path(__file__).resolve().parent.parent

    app = Flask(
        __name__,
        template_folder=str(base_dir / "templates"),
        static_folder=str(base_dir / "static"),
    )

    app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY", "dev-flask-secret-change-in-production"
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(api_auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(listing_bp)

    @app.route("/health")
    def health():
        return {"status": "ok"}, 200

    return app
