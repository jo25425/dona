import re
import sqlite3
import uuid
from pathlib import Path

db_path = Path("chat.db")
assert db_path.exists()

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Function to replace non-whitespace characters with 'x'
def mask_text(text):
    if text is None:
        return None  # Preserve NULL values
    return re.sub(r'\S', 'x', text)  # Replace all non-whitespace characters

# Fetch data from the message table
cursor.execute("SELECT ROWID, text FROM message")  # Adjust column names if needed
rows = cursor.fetchall()

# Update the message table safely
for row in rows:
    masked_value = mask_text(row[1])
    cursor.execute("UPDATE message SET text = ? WHERE ROWID = ?", (masked_value, row[0]))

# Set destination_caller_id and account to NULL in the message table
cursor.execute("UPDATE message SET destination_caller_id = NULL, account = NULL")

cursor.execute("SELECT DISTINCT display_name FROM chat")
chat_rows = cursor.fetchall()
for row in chat_rows:
    new_uuid = str(uuid.uuid4())  # Generate a unique UUID
    cursor.execute("UPDATE chat SET display_name = ? WHERE display_name = ?", (new_uuid, row[0]))

# Fetch all chat row IDs
cursor.execute("SELECT DISTINCT guid FROM chat")
chat_rows = cursor.fetchall()

# Update each row in the chat table with a unique UUID and set account_login to NULL
for row in chat_rows:
    new_uuid = str(uuid.uuid4())  # Generate a unique UUID
    cursor.execute("UPDATE chat SET guid = ?, chat_identifier = NULL, last_addressed_handle = NULL, account_login = NULL WHERE guid = ?", (new_uuid, row[0]))

# Fetch all handle row IDs
cursor.execute("SELECT DISTINCT id FROM handle")
handle_rows = cursor.fetchall()

# Update each row in the handle table with a unique UUID for id and NULL for uncanonicalized_id
for row in handle_rows:
    new_uuid = str(uuid.uuid4())  # Generate a unique UUID
    cursor.execute("UPDATE handle SET id = ?, uncanonicalized_id = NULL WHERE id = ?", (new_uuid, row[0]))

# Commit changes and close the connection
conn.commit()
conn.close()
