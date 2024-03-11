from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def get_json():
    # Specify the path to your JSON file
    json_file_path = os.path.join(os.path.dirname(__file__), 'n8n_node_list_partial.json')

    # Open and read the JSON file
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)

    # Return the JSON data as a response
    return jsonify(data)
