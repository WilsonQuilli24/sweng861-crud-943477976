import os
import requests
from dotenv import load_dotenv
from flask import Flask, redirect, render_template, url_for, request, jsonify, abort
from authlib.integrations.flask_client import OAuth
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from functools import wraps, lru_cache
import logging
from collections import defaultdict
from time import time
import sqlite3
import jwt  
from flasgger import Swagger

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev")
Swagger(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 3600

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

RATE_LIMIT_WINDOW = 60 
MAX_REQUESTS = 10
request_log = defaultdict(list)

def rate_limit(ip, endpoint):
    now = time()
    key = f"{ip}:{endpoint}"
    request_log[key] = [t for t in request_log[key] if now - t < RATE_LIMIT_WINDOW]
    if len(request_log[key]) >= MAX_REQUESTS:
        logging.warning(f"Rate limit exceeded for {ip} on {endpoint}")
        return False
    request_log[key].append(now)
    return True

def require_jwt(role=None):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            ip = request.remote_addr
            if not rate_limit(ip, f.__name__):
                return jsonify({"error": "Too Many Requests", "message": "Rate limit exceeded"}), 429

            token = request.headers.get("Authorization")
            if not token or not token.startswith("Bearer "):
                return jsonify({"error": "Unauthorized", "message": "Missing or invalid token"}), 401
            token = token.split(" ")[1]

            try:
                payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
                request.user_id = payload["user_id"]
                request.user_email = payload["email"]
                request.user_role = payload.get("role", "user")

                if role and request.user_role != role:
                    return jsonify({"error": "Forbidden", "message": "Insufficient permissions"}), 403
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Unauthorized", "message": "Token expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Unauthorized", "message": "Invalid token"}), 401

            return f(*args, **kwargs)
        return wrapper
    return decorator

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    name = db.Column(db.String(150))
    role = db.Column(db.String(50), default="user")  
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = db.Column(db.DateTime, default=datetime.utcnow)

DOG_DB = "dog_api.db"

def get_dog_db():
    return sqlite3.connect(DOG_DB)

def init_dog_db():
    conn = get_dog_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS breeds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            breed TEXT UNIQUE NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subbreeds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            breed_id INTEGER NOT NULL,
            subbreed TEXT NOT NULL,
            FOREIGN KEY (breed_id) REFERENCES breeds(id)
        )
    """)
    conn.commit()
    conn.close()

oauth = OAuth(app)
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request"}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/auth/login")
def auth_login():
    ip = request.remote_addr
    if not rate_limit(ip, "login"):
        return jsonify({"error": "Too Many Requests", "message": "Login rate limit exceeded"}), 429
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
        user = User(provider_id=provider_id, email=email, name=name, role="user")
        db.session.add(user)
    db.session.commit()

    payload = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return jsonify({
        "message": "Login successful",
        "email": email,
        "name": name,
        "token": token
    })

DOG_API_URL = "https://dog.ceo/api/breeds/list/all"

def fetch_and_store_dog_breeds():
    """Fetch breeds from Dog CEO API, validate, and store in SQLite."""
    try:
        response = requests.get(DOG_API_URL, timeout=10)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        logging.error(f"Failed to fetch from Dog CEO API: {e}")
        return False

    if "message" not in data or not isinstance(data["message"], dict):
        logging.error("API returned invalid data structure")
        return False

    conn = get_dog_db()
    cursor = conn.cursor()

    for breed, subbreeds in data["message"].items():
        breed_clean = breed.strip()
        if not breed_clean:
            continue
        try:
            cursor.execute("INSERT OR IGNORE INTO breeds (breed) VALUES (?)", (breed_clean,))
        except Exception as e:
            logging.error(f"Failed to insert breed {breed_clean}: {e}")
            continue
        cursor.execute("SELECT id FROM breeds WHERE breed = ?", (breed_clean,))
        breed_id = cursor.fetchone()[0]

        for sub in subbreeds:
            sub_clean = sub.strip()
            if not sub_clean:
                continue
            try:
                cursor.execute(
                    "INSERT OR IGNORE INTO subbreeds (breed_id, subbreed) VALUES (?, ?)",
                    (breed_id, sub_clean)
                )
            except Exception as e:
                logging.error(f"Failed to insert subbreed {sub_clean}: {e}")

    conn.commit()
    conn.close()
    logging.info("Dog breeds and subbreeds updated from Dog CEO API")
    return True

@lru_cache(maxsize=128)
def cached_get_breeds():
    conn = get_dog_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, breed FROM breeds")
    breeds = [{"id": r[0], "breed": r[1]} for r in cursor.fetchall()]
    conn.close()
    return breeds

@app.route("/api/hello", methods=["GET"])
@require_jwt()
def api_hello():
    return jsonify({"message": f"Hello, {request.user_email}!"})

@app.route("/api/breeds", methods=["GET"])
@require_jwt()
def get_breeds():
    return jsonify(cached_get_breeds())

@app.route("/api/breeds/<int:breed_id>", methods=["GET"])
@require_jwt()
def get_breed(breed_id):
    conn = get_dog_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, breed FROM breeds WHERE id = ?", (breed_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        abort(404)
    return jsonify({"id": row[0], "breed": row[1]})

@app.route("/api/breeds/fetch_external", methods=["POST"])
@require_jwt(role="admin")
def fetch_external_breeds():
    """Fetch breeds from Dog CEO API and store in DB."""
    success = fetch_and_store_dog_breeds()
    if not success:
        return jsonify({"error": "Failed to fetch external API"}), 500
    cached_get_breeds.cache_clear()
    return jsonify({"message": "External breeds fetched and stored"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        init_dog_db()
        fetch_and_store_dog_breeds() 
    app.run(host="0.0.0.0", port=5002, debug=True)