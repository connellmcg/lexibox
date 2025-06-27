#!/usr/bin/env python3
"""
Migration script to add organizations, user_invitations tables, and org fields to users.
"""
import sqlite3
import os

def migrate_organizations():
    db_path = os.path.join(os.path.dirname(__file__), 'lexibox.db')
    if not os.path.exists(db_path):
        print("Database file not found. Please run the application first to create the database.")
        return
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        # Create organizations table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS organizations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME
        )
        """)
        print("✓ organizations table ensured")

        # Add organization_id and is_org_admin columns to users
        cursor.execute("PRAGMA table_info(users)")
        columns = [col[1] for col in cursor.fetchall()]
        if 'organization_id' not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN organization_id INTEGER REFERENCES organizations(id)")
            print("✓ Added organization_id to users")
        else:
            print("✓ organization_id already exists in users")
        if 'is_org_admin' not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN is_org_admin BOOLEAN DEFAULT FALSE")
            print("✓ Added is_org_admin to users")
        else:
            print("✓ is_org_admin already exists in users")

        # Create user_invitations table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_invitations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            organization_id INTEGER NOT NULL REFERENCES organizations(id),
            invited_by_user_id INTEGER NOT NULL REFERENCES users(id),
            accepted BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            accepted_at DATETIME
        )
        """)
        print("✓ user_invitations table ensured")

        conn.commit()
        print("✓ Migration completed successfully!")
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_organizations() 