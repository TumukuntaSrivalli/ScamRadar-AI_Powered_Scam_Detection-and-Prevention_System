import os
import sqlite3
import json
from datetime import datetime

# Try MySQL import
try:
    import mysql.connector
    MYSQL_AVAILABLE = True
except ImportError:
    MYSQL_AVAILABLE = False

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Srivalli@2007")
DB_NAME = os.getenv("DB_NAME", "scamradar")

# Local SQLite fallback path if needed
SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), "scamradar.db")

def get_db_connection():
    """Connect to MySQL database server, creating database if needed."""
    if MYSQL_AVAILABLE:
        try:
            # First connect without db name to ensure DB exists
            server_conn = mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD
            )
            cursor = server_conn.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}`")
            server_conn.close()

            # Connect to scamradar DB
            conn = mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME
            )
            return ("mysql", conn)
        except Exception as e:
            print(f"[DB WARNING] MySQL connection failed: {e}. Falling back to local SQLite.")
    
    # SQLite fallback
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return ("sqlite", conn)

def init_db():
    """Creates users and scam_reports tables in MySQL."""
    db_type, conn = get_db_connection()
    cursor = conn.cursor()

    if db_type == "mysql":
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scam_reports (
                id VARCHAR(100) PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL,
                file_name VARCHAR(255) NOT NULL,
                file_type VARCHAR(50) NOT NULL,
                is_scam TINYINT(1) NOT NULL,
                confidence_score INT NOT NULL,
                category VARCHAR(255) NOT NULL,
                transcript TEXT,
                recommendations JSON,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    else:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                created_at TEXT
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scam_reports (
                id TEXT PRIMARY KEY,
                user_email TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_type TEXT NOT NULL,
                is_scam INTEGER NOT NULL,
                confidence_score INTEGER NOT NULL,
                category TEXT NOT NULL,
                transcript TEXT,
                recommendations TEXT,
                created_at TEXT
            )
        """)
        conn.commit()

    conn.close()

    # Seed initial users in MySQL if not present
    register_user("System Administrator", "admin@scamradar.com", "admin123", "admin")
    register_user("Demo Enterprise User", "user@enterprise.com", "user123", "user")

def register_user(name: str, email: str, password: str, role: str = "user"):
    """Registers user in MySQL storing name, email, password, role."""
    db_type, conn = get_db_connection()
    cursor = conn.cursor()
    clean_email = email.strip().lower()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        if db_type == "mysql":
            cursor.execute("SELECT email FROM users WHERE LOWER(email) = %s", (clean_email,))
            if cursor.fetchone():
                conn.close()
                return False, "Email address already registered"
            
            cursor.execute(
                "INSERT INTO users (name, email, password, role, created_at) VALUES (%s, %s, %s, %s, %s)",
                (name, clean_email, password, role, now_str)
            )
        else:
            cursor.execute("SELECT email FROM users WHERE LOWER(email) = ?", (clean_email,))
            if cursor.fetchone():
                conn.close()
                return False, "Email address already registered"

            cursor.execute(
                "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)",
                (name, clean_email, password, role, now_str)
            )

        conn.commit()
        conn.close()
        return True, "User registered successfully"
    except Exception as e:
        conn.close()
        return False, str(e)

def login_user(email: str, password: str):
    """Authenticates user against MySQL database."""
    db_type, conn = get_db_connection()
    cursor = conn.cursor()
    clean_email = email.strip().lower()

    if db_type == "mysql":
        cursor.execute("SELECT name, email, password, role FROM users WHERE LOWER(email) = %s", (clean_email,))
        user = cursor.fetchone()
    else:
        cursor.execute("SELECT name, email, password, role FROM users WHERE LOWER(email) = ?", (clean_email,))
        user = cursor.fetchone()

    conn.close()

    if not user:
        return False, "User not found", None

    if db_type == "mysql" and isinstance(user, tuple):
        u_name, u_email, u_pwd, u_role = user
    elif db_type == "sqlite":
        u_name, u_email, u_pwd, u_role = user["name"], user["email"], user["password"], user["role"]
    else:
        u_name, u_email, u_pwd, u_role = user[0], user[1], user[2], user[3]

    if u_pwd != password.strip():
        return False, "Invalid password", None

    return True, "Login successful", {"name": u_name, "email": u_email, "role": u_role}

def get_all_users():
    """Returns list of registered users with name, email, password, role from MySQL."""
    db_type, conn = get_db_connection()
    cursor = conn.cursor()
    
    if db_type == "mysql":
        cursor.execute("SELECT id, name, email, password, role, created_at FROM users")
        rows = cursor.fetchall()
        users = [{"id": r[0], "name": r[1], "email": r[2], "password": r[3], "role": r[4], "created_at": str(r[5])} for r in rows]
    else:
        cursor.execute("SELECT id, name, email, password, role, created_at FROM users")
        rows = cursor.fetchall()
        users = [{"id": r["id"], "name": r["name"], "email": r["email"], "password": r["password"], "role": r["role"], "created_at": r["created_at"]} for r in rows]

    conn.close()
    return users

def save_report(report_dict: dict):
    """Saves scan report record into MySQL database."""
    db_type, conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    rec_json = json.dumps(report_dict.get("recommendations", []))
    is_scam_val = 1 if report_dict.get("is_scam") else 0

    if db_type == "mysql":
        cursor.execute("""
            INSERT INTO scam_reports (id, user_email, file_name, file_type, is_scam, confidence_score, category, transcript, recommendations, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE confidence_score=VALUES(confidence_score)
        """, (
            report_dict["id"],
            report_dict["user_email"],
            report_dict["file_name"],
            report_dict["file_type"],
            is_scam_val,
            report_dict["confidence_score"],
            report_dict["category"],
            report_dict.get("transcript", ""),
            rec_json,
            now_str
        ))
    else:
        cursor.execute("""
            INSERT OR REPLACE INTO scam_reports (id, user_email, file_name, file_type, is_scam, confidence_score, category, transcript, recommendations, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            report_dict["id"],
            report_dict["user_email"],
            report_dict["file_name"],
            report_dict["file_type"],
            is_scam_val,
            report_dict["confidence_score"],
            report_dict["category"],
            report_dict.get("transcript", ""),
            rec_json,
            now_str
        ))

    conn.commit()
    conn.close()

def get_reports_by_user(user_email: str):
    """Fetches reports for specific user from MySQL."""
    db_type, conn = get_db_connection()
    cursor = conn.cursor()
    clean_email = user_email.strip().lower()

    if db_type == "mysql":
        cursor.execute("SELECT id, user_email, file_name, file_type, is_scam, confidence_score, category, transcript, recommendations, created_at FROM scam_reports WHERE LOWER(user_email) = %s ORDER BY created_at DESC", (clean_email,))
        rows = cursor.fetchall()
        reports = [
            {
                "id": r[0], "userEmail": r[1], "fileName": r[2], "fileType": r[3],
                "isScam": bool(r[4]), "confidenceScore": r[5], "category": r[6],
                "transcript": r[7], "recommendations": json.loads(r[8]) if r[8] else [], "date": str(r[9])
            } for r in rows
        ]
    else:
        cursor.execute("SELECT id, user_email, file_name, file_type, is_scam, confidence_score, category, transcript, recommendations, created_at FROM scam_reports WHERE LOWER(user_email) = ? ORDER BY created_at DESC", (clean_email,))
        rows = cursor.fetchall()
        reports = [
            {
                "id": r["id"], "userEmail": r["user_email"], "fileName": r["file_name"], "fileType": r["file_type"],
                "isScam": bool(r["is_scam"]), "confidenceScore": r["confidence_score"], "category": r["category"],
                "transcript": r["transcript"], "recommendations": json.loads(r["recommendations"]) if r["recommendations"] else [], "date": r["created_at"]
            } for r in rows
        ]

    conn.close()
    return reports
