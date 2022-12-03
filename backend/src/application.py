# %%
import os
import numpy as np
import pandas as pd
from datetime import timedelta
import json
import requests
from flask import Flask, flash, redirect, render_template, request, Response, session, abort, url_for, jsonify
from flask_jwt import JWT, jwt_required, current_identity
import ast
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask App
application = Flask(__name__, template_folder='html')
application.config['SECRET_KEY'] = 'secret'
application.config['JWT_EXPIRATION_DELTA'] = timedelta(days=7)

filedir = os.path.dirname(os.path.abspath(__file__))

# Initialize Cloud Firestore
cred = credentials.Certificate(f"{filedir}/firebase-secrets.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load county data into memory at runtime to make request time quicker
csv_path = os.path.join(filedir, "../../dataCollection/States&Counties.csv")
states_counties_df = pd.read_csv(csv_path).set_index("State")
states_counties_dict = states_counties_df.to_dict()["Area_name"]
state_abbrevs = list(states_counties_dict.keys())

# Flask authentication functions
# Firebase users table is indexed/identified by username
def authenticate(username, password):
    user = get_doc(collection = "users", doc_name = username)
    if user and user.get("password").encode('utf-8') == password.encode('utf-8'):
        return user

def identity(payload):
    user_id = payload['identity']
    return get_doc(collection = "users", doc_name = user_id)

jwt = JWT(application, authenticate, identity)

# Helper to get a firebase document from a collection
def get_doc(collection, doc_name):
    doc = db.collection(collection).document(doc_name).get()
    if doc.exists:
        return doc
    else:
        return None


######### HTTP Routes ############

# Will use this to compile recommendations per user
# Receive user id, query firebase for preference/living history data, compile recommendation
@application.route("/get_recommendations", methods=["POST"])
@jwt_required()
def get_recommendations():
    # insecure to rely on body for user id (could get other users' recs): 
    # user_id = request.args.get("user_id")
    # instead use flask-jwt's current_identity:
    if current_identity is None:
        return Response("Could not identify user", status=401)
    return

# Will use this to insert user and their prefs into Firebase
@application.route("/insert_user", methods=["POST"]) 
def insert_user():
    args = request.form.to_dict()
    try:
        username = args['username']
        password = args['password']
    except KeyError:
        return Response("Missing user/pass", status=422)
    if len(username) < 4 or len(password) < 4:
        return Response("user/pass too short", status=422)
    # If username already exists in db
    if get_doc(collection = "users", doc_name = username) is not None:
        return Response("Duplicate username exists, try logging in?", status=409)
    else:
        db.collection('users').document(username).set({"password" : password})
        return Response("Insert success", status=200)

# Attach user prefs to existing db user
@application.route("/insert_user_prefs", methods=["POST"])
@jwt_required()
def insert_user_prefs():
    body = request.json
    if not body['population'].isnumeric() or not body['temperature'].isnumeric():
        return Response("Pop, temp must be numbers", status=422)
    
    # Should add all the pref data as fields for this user doc
    db.collection('users').document(current_identity.id).update({ "prefs" : body })
    return Response(status=200)


# Attach living history to existing db user
@application.route("/insert_living_history", methods=["POST"])
@jwt_required()
def insert_living_history():
    body = request.json
    db.collection('users').document(current_identity.id).update({ "history" : body })
    return Response(status=200)


# Will use this to insert user rating for their recommendations
@application.route("/add_user_rating", methods=["POST"])
def add_rating():
    return

# Helper route to get the counties associated with a state abbreviation
# Helpful for populating Select/Dropdowns on frontend
@application.route("/get_counties", methods=["GET"])
def get_counties():
    state = request.args.get("state")
    if state is None:
        return Response("Missing required query param 'state'", status=422)
    counties = states_counties_dict[state]
    return jsonify(ast.literal_eval(counties))


if __name__ == "__main__":
    application.run(host='127.0.0.1', port=5000, debug=False)

