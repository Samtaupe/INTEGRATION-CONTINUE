import os

from flask import Flask, jsonify
from pymongo import MongoClient
from pymongo.errors import PyMongoError

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB = os.environ.get("MONGO_DB", "tp1")

app = Flask(__name__)

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[MONGO_DB]


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/db")
def db_status():
    try:
        client.admin.command("ping")
        return jsonify(
            status="ok",
            database=MONGO_DB,
            collections=db.list_collection_names(),
        )
    except PyMongoError as e:
        return jsonify(status="error", message=str(e)), 500
