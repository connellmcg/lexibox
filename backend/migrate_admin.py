#!/usr/bin/env python3
"""
Migration script to add is_admin column and make a user an admin
"""

import sqlite3
import os

def migrate_admin():
    # Get the database path
    db_path = os.path.join(os.path.dirname(__file__), 'lexibox.db')
    
    # Get admin email from environment variable or use default
    admin_email = os.getenv('ADMIN_EMAIL', 'cmcginley@gmail.com')
    
    if not os.path.exists(db_path):
        print("Database file not found. Please run the application first to create the database.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if is_admin column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'is_admin' not in columns:
            print("Adding is_admin column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE")
            print("✓ Added is_admin column")
        else:
            print("✓ is_admin column already exists")
        
        # Make the specified user an admin
        print(f"Making {admin_email} an admin...")
        cursor.execute(
            "UPDATE users SET is_admin = TRUE WHERE email = ?",
            (admin_email,)
        )
        
        if cursor.rowcount > 0:
            print(f"✓ Made {admin_email} an admin")
        else:
            print(f"⚠ User {admin_email} not found. They will become admin when they sign up.")
        
        # Commit changes
        conn.commit()
        print("✓ Migration completed successfully!")
        
        # Show current admin users
        cursor.execute("SELECT name, email FROM users WHERE is_admin = TRUE")
        admin_users = cursor.fetchall()
        
        if admin_users:
            print("\nCurrent admin users:")
            for name, email in admin_users:
                print(f"  - {name} ({email})")
        else:
            print("\nNo admin users found.")
            
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_admin() 