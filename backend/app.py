import os
from dotenv import load_dotenv
from flask import Flask, redirect, render_template, url_for, session, request, jsonify
from authlib.integrations.flask_client import OAuth
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from functools import wraps
import logging
from collections import defaultdict
from time import time


load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    name = db.Column(db.String(150))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = db.Column(db.DateTime, default=datetime.utcnow)

oauth = OAuth(app)
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

RATE_LIMIT_WINDOW = 60 
MAX_REQUESTS = 10

request_log = defaultdict(list)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def rate_limit(ip, endpoint):
    now = time()
    key = f"{ip}:{endpoint}"

    request_log[key] = [t for t in request_log[key] if now - t < RATE_LIMIT_WINDOW]

    if len(request_log[key]) >= MAX_REQUESTS:
        logging.warning(f"Rate limit exceeded for {ip} on {endpoint}")
        return False

    request_log[key].append(now)
    return True

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        ip = request.remote_addr

        if not rate_limit(ip, "protected"):
            return jsonify({
                "error": "Too Many Requests",
                "message": "Rate limit exceeded"
            }), 429

        user_id = session.get("user_id")
        user_email = session.get("user_email")

        if not user_id:
            logging.warning(f"Unauthorized access attempt from IP {ip}")
            return jsonify({
                "error": "Unauthorized",
                "message": "Valid access token is required"
            }), 401

        request.user_id = user_id
        request.user_email = user_email
        return f(*args, **kwargs)
    return decorated


@app.route("/")
def index():
    user_email = session.get("user_email")
    return render_template("index.html", user_email=user_email)

@app.route("/auth/login")
def auth_login():
    ip = request.remote_addr

    if not rate_limit(ip, "login"):
        return jsonify({
            "error": "Too Many Requests",
            "message": "Login rate limit exceeded"
        }), 429

    redirect_uri = url_for("auth_callback", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@app.route("/auth/callback")
def auth_callback():
    oauth.google.authorize_access_token()
    user_info = oauth.google.userinfo()

    provider_id = user_info["sub"]
    email = user_info["email"]
    name = user_info.get("name", "")

    user = User.query.filter_by(provider_id=provider_id).first()
    if user:
        user.email = email
        user.name = name
        user.last_login_at = datetime.utcnow()
    else:
        user = User(
            provider_id=provider_id,
            email=email,
            name=name
        )
        db.session.add(user)

    db.session.commit()

    session["user_id"] = user.id
    session["user_email"] = user.email

    return jsonify({
        "message": "Login successful",
        "email": email,
        "name": name
    })

@app.route("/api/hello", methods=["GET"])
@require_auth
def api_hello():
    return jsonify({
        "message": f"Hello, {request.user_email}!"
    })

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
