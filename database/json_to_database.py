import json
import psycopg2
from dotenv import load_dotenv

load_dotenv()
# Replace these variables with your database connection details
db_name = 'n8n_copilot_dev'
db_user = 'rockship'
db_password = 'rockship'
db_host = '13.214.145.200'
db_port = '5432'

# Path to your JSON file
json_file_path = './node_list/xml.json'

# Read the JSON data from the file
with open(json_file_path, 'r') as file:
    json_data = json.load(file)

# Convert the Python dictionary to a JSON string
json_str = json.dumps(json_data)

# Connect to your PostgreSQL database
conn = psycopg2.connect(
    dbname=db_name,
    user=db_user,
    password=db_password,
    host=db_host,
    port=db_port
)

try:
    # Create a cursor object
    cur = conn.cursor()

    # SQL statement to insert the JSON data
    sql = "INSERT INTO n8n_node_table (n8n_node) VALUES (%s);"

    # Execute the SQL statement
    cur.execute(sql, (json_str,))

    # Commit the transaction
    conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()

    print("JSON data has been inserted into the database.")
except Exception as e:
    print("Error while inserting JSON data:", e)
    # Rollback in case of error
    conn.rollback()
    # Close the database connection
    conn.close()
