import requests
import sqlite3

url = "https://dog.ceo/api/breeds/list/all"
response = requests.get(url)
data = response.json()

breeds = data.get("message", {})

conn = sqlite3.connect("dog_api.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS breeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    breed TEXT UNIQUE NOT NULL
);
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS subbreeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    breed_id INTEGER,
    subbreed TEXT,
    FOREIGN KEY(breed_id) REFERENCES breeds(id),
    UNIQUE(breed_id, subbreed)
);
""")

for breed, sub_list in breeds.items():
    cursor.execute("INSERT OR IGNORE INTO breeds (breed) VALUES (?)", (breed,))
    cursor.execute("SELECT id FROM breeds WHERE breed = ?", (breed,))
    breed_id = cursor.fetchone()[0]

    for sub in sub_list:
        cursor.execute(
            "INSERT OR IGNORE INTO subbreeds (breed_id, subbreed) VALUES (?, ?)",
            (breed_id, sub)
        )

conn.commit()
conn.close()
print("Saved API data to database successfully!")