"""
Authentication Controller - Kimlik Dogrulama Controller

HTTP isteklerini alir, auth service'i cagirir ve cevap dondurur.
Sunum katmaninin bir parcasidir.
"""

from flask import (
    flash,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

from app.business.services.auth_service import AuthService
from app.shared.exceptions import (
    AuthenticationError,
    DuplicateEmailError,
    ValidationError,
)


class AuthController:
    """
    Kimlik dogrulama controller

    Kayit ve giris endpoint'lerini yonetir.
    """

    def __init__(self):
        self.auth_service = AuthService()

    def show_register_page(self):
        return render_template("auth/register.html")

    def show_login_page(self):
        return render_template("auth/login.html")

    def register(self):
        name = email = role = ""
        try:
            name = request.form.get("name", "").strip()
            email = request.form.get("email", "").strip()
            password = request.form.get("password", "")
            role = request.form.get("role", "")
            terms_accepted = request.form.get("terms") == "on"

            result = self.auth_service.register(
                name=name,
                email=email,
                password=password,
                role=role,
                terms_accepted=terms_accepted,
            )

            session["user_id"] = result["user"]["id"]
            session["user_email"] = result["user"]["email"]
            session["user_role"] = result["user"]["role"]
            session["token"] = result["token"]

            flash("Kayit basarili! Hesabiniza giris yaptiniz.", "success")

            if role == "sitter":
                return redirect(url_for("profile.create_profile"))
            return redirect(url_for("listing.list_sitters"))

        except ValidationError as e:
            flash(str(e), "error")
            return render_template(
                "auth/register.html",
                name=name,
                email=email,
                role=role,
            )

        except DuplicateEmailError as e:
            flash(str(e), "error")
            return render_template(
                "auth/register.html",
                name=name,
                email=email,
                role=role,
            )

        except Exception:
            flash(
                "Kayit sirasinda bir hata olustu. Lutfen tekrar deneyin.", "error"
            )
            return render_template("auth/register.html")

    def login(self):
        email = ""
        try:
            email = request.form.get("email", "").strip()
            password = request.form.get("password", "")

            result = self.auth_service.login(email=email, password=password)

            session["user_id"] = result["user"]["id"]
            session["user_email"] = result["user"]["email"]
            session["user_role"] = result["user"]["role"]
            session["token"] = result["token"]

            flash("Giris basarili!", "success")

            if result["user"]["role"] == "sitter":
                return redirect(url_for("profile.view_profile"))
            return redirect(url_for("listing.list_sitters"))

        except (ValidationError, AuthenticationError) as e:
            flash(str(e), "error")
            return render_template("auth/login.html", email=email)

        except Exception:
            flash(
                "Giris sirasinda bir hata olustu. Lutfen tekrar deneyin.", "error"
            )
            return render_template("auth/login.html", email=email)

    def logout(self):
        session.clear()
        flash("Cikis yaptiniz.", "info")
        return redirect(url_for("auth.login_page"))

    def api_register(self):
        try:
            data = request.get_json() or {}

            result = self.auth_service.register(
                name=data.get("name"),
                email=data.get("email"),
                password=data.get("password"),
                role=data.get("role"),
                terms_accepted=data.get("terms_accepted", False),
            )

            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Kayit basarili",
                        "data": result,
                    }
                ),
                201,
            )

        except (ValidationError, DuplicateEmailError) as e:
            return (
                jsonify({"success": False, "message": str(e)}),
                e.status_code,
            )

        except Exception:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Kayit sirasinda bir hata olustu",
                    }
                ),
                500,
            )

    def api_login(self):
        try:
            data = request.get_json() or {}

            result = self.auth_service.login(
                email=data.get("email"),
                password=data.get("password"),
            )

            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Giris basarili",
                        "data": result,
                    }
                ),
                200,
            )

        except (ValidationError, AuthenticationError) as e:
            return (
                jsonify({"success": False, "message": str(e)}),
                e.status_code,
            )

        except Exception:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Giris sirasinda bir hata olustu",
                    }
                ),
                500,
            )
