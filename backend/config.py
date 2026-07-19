import os
import json
import secrets
from pathlib import Path
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "resume_data.json"
AVATAR_DIR = BASE_DIR / "static" / "avatars"

# Create directories if they don't exist
DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
AVATAR_DIR.mkdir(parents=True, exist_ok=True)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
SESSION_TOKEN = secrets.token_hex(32)

# Database connection details
DATABASE_URL = os.getenv("DATABASE_URL")

# Flag to check if we can connect to PG
USE_PG = True

def get_db_connection():
    """Establish a direct psycopg2 database connection."""
    return psycopg2.connect(DATABASE_URL)

# Verify DB connection and run migrations/seeding
try:
    print(f"Connecting to database at: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Create table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS portfolio_records (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            profile_summary TEXT NOT NULL,
            avatar_url VARCHAR(1024),
            contact JSONB NOT NULL,
            experiences JSONB NOT NULL,
            projects JSONB NOT NULL,
            skills JSONB NOT NULL,
            education JSONB NOT NULL,
            certifications JSONB NOT NULL
        );
    """)
    conn.commit()

    # 2. Check if seeder is needed
    cursor.execute("SELECT COUNT(*) FROM portfolio_records;")
    count = cursor.fetchone()[0]
    
    if count == 0:
        print("Database is empty. Seeding initial parsed PDF data...")
        # Load seed data from JSON
        if DATA_FILE.exists():
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                seed = json.load(f)
        else:
            # Fallback mock empty
            seed = {
                "name": "Ar-jay C. Dayanan",
                "title": "Full-Stack Developer",
                "profileSummary": "",
                "avatarUrl": "",
                "contact": {"email": "acdayanan@gmail.com", "phone": "", "location": ""},
                "experiences": [],
                "projects": [],
                "skills": [],
                "education": [],
                "certifications": []
            }
        
        cursor.execute("""
            INSERT INTO portfolio_records 
            (name, title, profile_summary, avatar_url, contact, experiences, projects, skills, education, certifications)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (
            seed.get("name", "Ar-jay C. Dayanan"),
            seed.get("title", "Full-Stack Developer"),
            seed.get("profileSummary", ""),
            seed.get("avatarUrl", ""),
            json.dumps(seed.get("contact", {})),
            json.dumps(seed.get("experiences", [])),
            json.dumps(seed.get("projects", [])),
            json.dumps(seed.get("skills", [])),
            json.dumps(seed.get("education", [])),
            json.dumps(seed.get("certifications", []))
        ))
        conn.commit()
        print("Database seeded successfully.")

    cursor.close()
    conn.close()

except Exception as db_err:
    print(f"Warning: PostgreSQL connection failed: {db_err}. Falling back to local file persistence.")
    USE_PG = False

# --- Data persistent operations ---

def prepare_data_orders(data: dict) -> None:
    """Assign order values to list elements matching their current array indices."""
    for list_key in ["experiences", "projects"]:
        item_list = data.get(list_key)
        if isinstance(item_list, list):
            for i, item in enumerate(item_list):
                if isinstance(item, dict):
                    item["order"] = i

def load_resume_data() -> dict:
    """Load resume data from PostgreSQL (or local JSON fallback)."""
    if not USE_PG:
        # Fallback to local JSON file
        if not DATA_FILE.exists():
            data = {"name": "Ar-jay C. Dayanan", "title": "Full-Stack Developer", "profileSummary": "", "avatarUrl": "", "contact": {"email": "", "phone": "", "location": ""}, "experiences": [], "projects": [], "skills": [], "education": [], "certifications": []}
        else:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
    else:
        # Load from PG database
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        try:
            cursor.execute("SELECT * FROM portfolio_records ORDER BY id LIMIT 1;")
            row = cursor.fetchone()
            if not row:
                data = {}
            else:
                data = {
                    "name": row["name"],
                    "title": row["title"],
                    "profileSummary": row["profile_summary"],
                    "avatarUrl": row["avatar_url"],
                    "contact": row["contact"],
                    "experiences": row["experiences"],
                    "projects": row["projects"],
                    "skills": row["skills"],
                    "education": row["education"],
                    "certifications": row["certifications"]
                }
        finally:
            cursor.close()
            conn.close()

    # Dynamic order processing and sorting
    if data:
        for list_key in ["experiences", "projects"]:
            item_list = data.get(list_key, [])
            if isinstance(item_list, list):
                for i, item in enumerate(item_list):
                    if isinstance(item, dict) and item.get("order") is None:
                        item["order"] = i
                # Sort in place
                data[list_key] = sorted(item_list, key=lambda x: x.get("order", 0) if isinstance(x, dict) else 0)

    return data

def save_resume_data(data: dict) -> None:
    """Write resume data back to PostgreSQL (or local JSON fallback)."""
    prepare_data_orders(data)
    if not USE_PG:
        # Fallback to local JSON file
        temp_file = DATA_FILE.with_suffix(".tmp")
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        temp_file.replace(DATA_FILE)
        return

    # Update in PG database
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if record exists
        cursor.execute("SELECT id FROM portfolio_records ORDER BY id LIMIT 1;")
        row = cursor.fetchone()
        
        if row:
            # Update existing
            cursor.execute("""
                UPDATE portfolio_records SET 
                    name = %s,
                    title = %s,
                    profile_summary = %s,
                    avatar_url = %s,
                    contact = %s,
                    experiences = %s,
                    projects = %s,
                    skills = %s,
                    education = %s,
                    certifications = %s
                WHERE id = %s;
            """, (
                data.get("name"),
                data.get("title"),
                data.get("profileSummary"),
                data.get("avatarUrl"),
                json.dumps(data.get("contact", {})),
                json.dumps(data.get("experiences", [])),
                json.dumps(data.get("projects", [])),
                json.dumps(data.get("skills", [])),
                json.dumps(data.get("education", [])),
                json.dumps(data.get("certifications", [])),
                row[0]
            ))
        else:
            # Insert first
            cursor.execute("""
                INSERT INTO portfolio_records 
                (name, title, profile_summary, avatar_url, contact, experiences, projects, skills, education, certifications)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                data.get("name"),
                data.get("title"),
                data.get("profileSummary"),
                data.get("avatarUrl"),
                json.dumps(data.get("contact", {})),
                json.dumps(data.get("experiences", [])),
                json.dumps(data.get("projects", [])),
                json.dumps(data.get("skills", [])),
                json.dumps(data.get("education", [])),
                json.dumps(data.get("certifications", []))
            ))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def patch_resume_data(data: dict) -> None:
    """Partially update resume data fields in PostgreSQL (or fallback)."""
    prepare_data_orders(data)
    if not USE_PG:
        current = load_resume_data()
        current.update(data)
        save_resume_data(current)
        return

    if not data:
        return

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM portfolio_records ORDER BY id LIMIT 1;")
        row = cursor.fetchone()
        
        if not row:
            return

        set_clauses = []
        params = []
        
        field_mapping = {
            "name": "name",
            "title": "title",
            "profileSummary": "profile_summary",
            "avatarUrl": "avatar_url",
            "contact": "contact",
            "experiences": "experiences",
            "projects": "projects",
            "skills": "skills",
            "education": "education",
            "certifications": "certifications"
        }
        
        for key, val in data.items():
            if key in field_mapping:
                col = field_mapping[key]
                set_clauses.append(f"{col} = %s")
                if key in ["contact", "experiences", "projects", "skills", "education", "certifications"]:
                    params.append(json.dumps(val))
                else:
                    params.append(val)
                    
        if not set_clauses:
            return
            
        query = f"UPDATE portfolio_records SET {', '.join(set_clauses)} WHERE id = %s;"
        params.append(row[0])
        
        cursor.execute(query, tuple(params))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def verify_session_token(token: str) -> bool:
    """Verify authorization token matches the session token."""
    expected = f"Bearer {SESSION_TOKEN}"
    return token == expected
