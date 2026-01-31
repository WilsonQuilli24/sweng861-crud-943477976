import requests
import sqlite3
import json

url = "https://dog.ceo/api/breeds/list/all"

response = requests.get(url)
data = response.json()

if "status" not in data or "message" not in data:
    raise ValueError("Unexpected API format!")

if data["status"] != "success":
    raise ValueError("API did not return success")

breeds = data["message"]

conn = sqlite3.connect("dog_api.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS breeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    breed TEXT NOT NULL
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS subbreeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    breed_id INTEGER,
    subbreed TEXT,
    FOREIGN KEY(breed_id) REFERENCES breeds(id)
);
""")

for breed, sub_list in breeds.items():
    cursor.execute("INSERT INTO breeds (breed) VALUES (?)", (breed,))
    breed_id = cursor.lastrowid

    for sub in sub_list:
        cursor.execute("INSERT INTO subbreeds (breed_id, subbreed) VALUES (?,?)", (breed_id, sub))

conn.commit()
conn.close()

print("Saved API data to database successfully!")