"""
Authentication Routes - Kimlik Dogrulama Route'lari

Kayit ve giris endpoint'lerini tanimlar.
Flask Blueprint kullanilarak modularize edilmistir.
"""

from flask import Blueprint

from app.presentation.controllers.auth_controller import AuthController

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
api_auth_bp = Blueprint("api_auth", __name__, url_prefix="/api/auth")

auth_controller = AuthController()


@auth_bp.route("/register", methods=["GET"])
def register_page():
    return auth_controller.show_register_page()


@auth_bp.route("/register", methods=["POST"])
def register():
    return auth_controller.register()


@auth_bp.route("/login", methods=["GET"])
def login_page():
    return auth_controller.show_login_page()


@auth_bp.route("/login", methods=["POST"])
def login():
    return auth_controller.login()


@auth_bp.route("/logout", methods=["GET"])
def logout():
    return auth_controller.logout()


@api_auth_bp.route("/register", methods=["POST"])
def api_register():
    return auth_controller.api_register()


@api_auth_bp.route("/login", methods=["POST"])
def api_login():
    return auth_controller.api_login()
