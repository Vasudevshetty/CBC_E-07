import sqlite3

DB_NAME = "rag_app.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def create_application_logs():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS application_logs
    (id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    user_id TEXT,
    user_query TEXT,
    model_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    conn.close()

def insert_application_logs(session_id, user_id, user_query, model_response):
    conn = get_db_connection()
    conn.execute('INSERT INTO application_logs (session_id, user_id, user_query, model_response) VALUES (?, ?, ?, ?)',
                 (session_id, user_id, user_query, model_response, ))
    conn.commit()
    conn.close()

def get_chat_history(session_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT user_query, model_response FROM application_logs WHERE session_id = ?', (session_id,))
    messages = []
    for row in cursor.fetchall():
        messages.extend([
            {"role": "human", "content": row['user_query']},
            {"role": "ai", "content": row['model_response']}
        ])
    conn.close()
    return messages

def get_all_session_ids():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT DISTINCT session_id FROM application_logs')
    session_ids = [row['session_id'] for row in cursor.fetchall()]
    conn.close()
    return session_ids

def get_sessions_by_user_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT DISTINCT session_id FROM application_logs WHERE user_id = ?', (user_id,))
    session_ids = [row['session_id'] for row in cursor.fetchall()]
    conn.close()
    return session_ids

def get_chats_by_session_id(session_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT user_query, model_response, created_at FROM application_logs WHERE session_id = ? ORDER BY created_at', (session_id,))
    
    chats = []
    for row in cursor.fetchall():
        chats.append({
            "user_query": row['user_query'],
            "model_response": row['model_response'],
            "created_at": row['created_at']
        })
    
    conn.close()
    return chats

def create_session(user_id):
    """
    Create a new session for a user and return the session ID.
    """
    import uuid
    session_id = str(uuid.uuid4())
    conn = get_db_connection()
    conn.execute('INSERT INTO application_logs (session_id, user_id, user_query, model_response) VALUES (?, ?, ?, ?)',
                 (session_id, user_id, "", "Session started"))
    conn.commit()
    conn.close()
    return session_id

def delete_session(session_id, user_id=None):
    """
    Delete a session and all its associated records.
    
    Parameters:
    - session_id: ID of the session to delete
    - user_id: Optional user ID for additional verification
    
    Returns the number of deleted records.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if user_id:
        # Delete only if both session_id and user_id match
        cursor.execute('DELETE FROM application_logs WHERE session_id = ? AND user_id = ?', 
                      (session_id, user_id))
    else:
        # Delete based on session_id only
        cursor.execute('DELETE FROM application_logs WHERE session_id = ?', (session_id,))
        
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    return deleted_count

create_application_logs()