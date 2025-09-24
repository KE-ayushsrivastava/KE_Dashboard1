import mysql.connector
from config import db_config

try:
    # Connect to DB
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Simple test query (row count from ek table)
    cursor.execute("SELECT COUNT(*) FROM cherry;")
    result = cursor.fetchone()
    print("Total rows:", result[0])

    # Close
    cursor.close()
    conn.close()

except mysql.connector.Error as err:
    print("Error:", err)
