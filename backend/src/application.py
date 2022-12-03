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

from scipy.spatial import distance
from collections import OrderedDict
import geopy.distance
import math
from operator import itemgetter

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
@application.route("/get_recommendations", methods=["GET"])
@jwt_required()
def get_recommendations():
    # insecure to rely on body for user id (could get other users' recs): 
    # user_id = request.args.get("user_id")
    # instead use flask-jwt's current_identity:
    if current_identity is None:
        return Response("Could not identify user", status=401)
    doc = db.collection('users').document(current_identity.id).get()
    living_history = doc.get("history")
    prefs = doc.get("prefs")

    print(living_history, prefs) # here's your data srajan & vedic :)
    
    recommendations = cosine_distance_calculator(living_history, prefs)
    
    return jsonify(recommendations)

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
@application.route("/add_living_history", methods=["POST"])
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

def cosine_distance_calculator(history, prefs, max_distance = 50):

    city_name = prefs["city"]

    weights = [0, 0, prefs['educationImp']/10, prefs['educationImp']/10, prefs['povertyImp']/10, 0, prefs['populationImp'] / 10, 
    prefs['costOfLivingImp'], 0, prefs['unemploymentImp'] / 10, prefs['precipitationImp'] / 10, prefs['temperatureImp'] / 10, prefs['costOfLivingImp'], prefs['costOfLivingImp']] 

    dataset = pd.read_csv("data.csv")

    avg = []

    for item in history:
        state = item['state']
        county = item['county']
        importance = item['locationImp']
        row = []
        row = dataset.loc[dataset['State'] == state]
        row = row.loc[row['Area_name'] == county]
        row = row.drop("State", axis = 1)
        row = row.drop("Area_name", axis = 1)
        
        row = np.array(row)[0]

        for i in range(len(row)):
            if type(row[i]) == str:
                if "," in row[i]:
                    row[i] = int(row[i].replace(",", ""))
            else: 
                row[i] = int(row[i])

        row = row[1:]

        if len(avg) == 0:
            avg = row
        else:
            avg = (avg + np.array(row)) / 2

    avg[7] = (avg[7] + int(prefs["population"])) / 2
    avg[11] = (avg[11] + int(prefs["temperature"])) / 2

    dist_list = {}

    for index, row in dataset.iterrows():
        state = row['State']
        county = row['Area_name']
        row = row.drop("State")
        row = row.drop("Area_name")

        for i in range(len(row)):
            if type(row[i]) == str:
                if "," in row[i]:
                    row[i] = int(row[i].replace(",", ""))
                else:
                    row[i] = int(row[i])
            else:
                row[i] = round(row[i])

        row = row[1:]

        dist_list[distance.cosine(avg, row, weights)] = [state, county]


    sorted_dictionary = OrderedDict(sorted(dist_list.items()))

    result = np.array(list(sorted_dictionary.items()), dtype = object)

    indices = np.where(result[:, 0] < 0.01)

    good_matches = result[indices[0]]
    
    latlong = pd.read_csv("CountyAndLocation.csv")

    newList = []
    
    for value, location in good_matches:
        State = location[0]
        County = location[1].split(" ")[0]

        result = latlong.loc[latlong['State'] == State]
        result = result.loc[latlong['Area_name'] == County]

        latitude = result['Latitude'].tolist()
        longitude = result['Longitude'].tolist()

        if len(latitude) != 0 and len(longitude) != 0:
            latitude = latitude[0][1:-1]
            longitude = longitude[0][1:-1]

        newList.append([value, State, location[1], latitude, longitude])

    new_coord = ()

    final_output = []

    if city_name != '':

        cities = pd.read_csv("majorcities.csv")
        row = cities.loc[cities['City'] == city_name]
        city_location = row["Location"].tolist()[0]
        city_location = city_location.split(" ")
        new_coord = (float(city_location[0][0:-2]), float(city_location[1][0:-2]))

        for stuff in newList:
            coords_1 = (stuff[3], stuff[4])
            dist = geopy.distance.geodesic(coords_1, new_coord).mi
            final_output.append([dist, stuff[0], stuff[1], stuff[2]])
            
        final_output = sorted(final_output, key=itemgetter(0))
        final_output = sorted(final_output[:5], key=itemgetter(1))

        temp_output = []

        for item in final_output:
            temp_output.append({"Distance": item[0], "Cos_Distance": item[1], "State": item[2], "County": item[3]})

        final_output = temp_output

    else:
        temp_output = newList[0:5]
        final_output = []

        for item in temp_output:
            final_output.append({"Distance": 0, "Cos_Distance": item[0], "State": item[1], "County": item[2]})

    return final_output


if __name__ == "__main__":
    application.run(host='127.0.0.1', port=5000, debug=False)

