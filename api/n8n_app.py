from flask import Flask, jsonify
import json

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from vercel flask"

# Define the route for the GET request
@app.route('/get-json', methods=['GET'])
def get_json():
    # Specify the path to your JSON file
    json_file_path = 'n8n_node_list_partial.json'

    # Open and read the JSON file
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)

    # Return the JSON data as a response
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
