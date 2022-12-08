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
import time

from scipy.spatial import distance
from collections import OrderedDict
import geopy.distance
import math
from operator import itemgetter
from sklearn.metrics import  pairwise 

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

# Compile recommendations per user
@application.route("/get_recommendations", methods=["GET"])
@jwt_required()
def get_recommendations():
    start = time.time() # for latency measurement
    # insecure to rely on body for user id (could get other users' recs): 
    # user_id = request.args.get("user_id")
    # instead use flask-jwt's current_identity:
    if current_identity is None:
        return Response("Could not identify user", status=401)
    doc = db.collection('users').document(current_identity.id).get()
    living_history = doc.get("history")
    prefs = doc.get("prefs")

    print(f"\nLiving History:\n{json.dumps(living_history, indent=4)}\n")
    print(f"\nUser Preferences:\n{json.dumps(prefs, indent=4)}\n")

    try:
        ratings = doc.get("ratings") # dict indexed by {county name}, {2 letter state}
    except KeyError:
        ratings = {}

    recommendations = cosine_distance_calculator(living_history, prefs, ratings)
    print(f"\nFinal Recommendations:\n{json.dumps(recommendations, indent=4)}\n")

    print(recommendations)
    end = time.time()

    print(f"Time elapsed to compile recommendations: {end - start}\n")

    return jsonify(recommendations)


# Insert user and their prefs into Firebase
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

# Get user prefs for existing db user (to populate page for returning users)
@application.route("/get_user_prefs", methods=["GET"])
@jwt_required()
def get_user_prefs():
    try:
        prefs = get_doc('users', current_identity.id).get("prefs")
        return jsonify(prefs)
    except KeyError:
        return Response(status=204) # no content to return


# Attach living history to existing db user
@application.route("/add_living_history", methods=["POST"])
@jwt_required()
def insert_living_history():
    body = request.json
    db.collection('users').document(current_identity.id).update({ "history" : body })
    return Response(status=200)

# Get living history for existing db user (to populate page for returning users)
@application.route("/get_living_history", methods=["GET"])
@jwt_required()
def get_living_history():
    try:
        history = get_doc('users', current_identity.id).get("history")
        return jsonify(history)
    except KeyError:
        return Response(status=204) # no content to return


# Will use this to insert user ratings for their recommendations
@application.route("/add_ratings", methods=["POST"])
@jwt_required()
def add_rating():
    body = request.json
    print(body)
    new_ratings = {f"{row['County']}, {row['State']}": {k: row[k] for k in ['State', 'County', 'Rating']} for row in body}
    try:
        # merge existing and new ratings, preferring new ratings
        existing_ratings = get_doc('users', current_identity.id).get("ratings")
        ratings = {**existing_ratings, **new_ratings}
        db.collection('users').document(current_identity.id).update({ "ratings" : ratings })
    except KeyError:
        # No existing ratings, initialize object in firebase
        db.collection('users').document(current_identity.id).update({ "ratings" : new_ratings })
    
    return Response(status=200)

@application.route("/get_ratings", methods=["GET"])
@jwt_required()
def get_ratings():
    try:
        ratings = get_doc('users', current_identity.id).get("ratings")
        return jsonify(ratings)
    except KeyError:
        return Response(status=204) # no content to return


# Helper route to get the counties associated with a state abbreviation
# Helpful for populating Select/Dropdowns on frontend
@application.route("/get_counties", methods=["GET"])
def get_counties():
    state = request.args.get("state")
    if state is None:
        return Response("Missing required query param 'state'", status=422)
    counties = states_counties_dict[state]
    return jsonify(ast.literal_eval(counties))


def euclidean_distance(vector1,vector2):
  return math.sqrt(sum(pow(i-j,2) for i, j in zip(vector1, vector2)))

def manhattan_distance(vector1,vector2):
  return sum(abs(a-b) for a,b in zip(vector1,vector2))


def cosine_distance_calculator(history, prefs, ratings, max_distance = 50):

    ignore = []
    good_ratings = []

    for county_rating in ratings.keys():
        rating = ratings[county_rating]
        if rating["Rating"] == 2 or rating["Rating"] == 1:
            ignore.append((rating['County'], rating['State']))
        elif rating['Rating'] >= 4:
            good_ratings.append((rating['County'], rating['State']))
            history.append({"county": rating["County"], "state": rating["State"], "locationImp": 5})

    city_name = prefs["city"]

    baseline = np.array([11.5, 26.7, 28.9, 32.9, 11.9, 331449281, 331893745, 67340, 100, 8.1, 2.673786415, 55.67093097, 8929.995715, 10140.25742])
    base_multiplier = np.array([1, 1, prefs['educationImp'] / 5, prefs['educationImp'] / 5, prefs['povertyImp'] / 5, 1, prefs['populationImp'] / 5, prefs['costOfLivingImp'] / 5, 1, prefs['unemploymentImp'] / 5, prefs['precipitationImp'] / 5, prefs['temperatureImp'] / 5, prefs['costOfLivingImp'] / 5, prefs['costOfLivingImp'] / 5])
	

    weights = [0, 0, prefs['educationImp']/10, prefs['educationImp']/10, prefs['povertyImp']/10, 0, prefs['populationImp'] / 10, prefs['costOfLivingImp'] / 10, 0, prefs['unemploymentImp'] / 10, prefs['precipitationImp'] / 10, prefs['temperatureImp'] / 10, prefs['costOfLivingImp'] / 10, prefs['costOfLivingImp'] / 10] 

    print(f"\nRecommendation weights: {weights}\n")

    dataset = pd.read_csv("data.csv")

    avg = []

    county_state = []

    for item in history:
        state = item['state']
        county = item['county']
        county_state.append((county, state))
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
    
    if len(avg) == 0:
        avg = np.multiply(baseline, base_multiplier).tolist()

    avg[7] = (avg[7] + int(prefs["population"])) / 2
    avg[11] = (avg[11] + int(prefs["temperature"])) / 2

    dist_list = {}
    euclidean_dists = {}
    manhattan_dists = {}

    print(f"\nDataset Head: \n{dataset.head()}\n")

    print(f"\nSearch Vector (created from preferences + living history + rating feedback): \n{avg if type(avg) == type(list()) else avg.tolist()}\n")
    print("\nComparison Matrix: (all counties):\n")
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

        if index < 10:
            print(row.tolist())

        dist_list[distance.cosine(avg, row, weights)] = [state, county]
        euclidean_dists[abs(euclidean_distance(avg, row))] = [state, county]
        manhattan_dists[abs(manhattan_distance(row, avg))] = [state, county]

    print("...")
    

    sorted_dictionary = OrderedDict(sorted(dist_list.items()))
    sorted_euclidean = OrderedDict(sorted(euclidean_dists.items()))
    sorted_manhattan = OrderedDict(sorted(manhattan_dists.items()))

    result = np.array(list(sorted_dictionary.items()), dtype = object)

    print(f"\nFull Cosine Results: \nCosine Distance \t County \n{pd.DataFrame(result[:10]).to_string(index=False, header=False)}\n...\n")
    print(f"\nFull Euclidean Results: \nEuclidean Distance \t County \n{pd.DataFrame(list(sorted_euclidean.items())[:10]).to_string(index=False, header=False)}\n...\n")
    print(f"\nFull Manhattan Results: \nManhattan Distance \t County \n{pd.DataFrame(list(sorted_manhattan.items())[:10]).to_string(index=False, header=False)}\n...\n")

    indices = np.where(result[:, 0] < 0.01)

    good_matches = result[indices[0]]

    print(f"\nFiltered Cosine Results: \nCosine Distance \t County \n{pd.DataFrame(good_matches).to_string(index=False, header=False)}\n")
    
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
            cs = (stuff[2], stuff[1])
            if (cs in county_state or cs in ignore) and cs not in good_ratings:
                continue
            coords_1 = (stuff[3], stuff[4])
            dist = geopy.distance.geodesic(coords_1, new_coord).mi
            final_output.append([dist, stuff[0], stuff[1], stuff[2]])
            
        final_output = sorted(final_output, key=itemgetter(0))
        final_output = sorted(final_output[:5], key=itemgetter(1))

        temp_output = []

        for item in final_output:
            check_rating = str(item[3]) + ", " +  str(item[2])
            if check_rating in ratings.keys():
                temp_output.append({"Distance": item[0], "Cos_Distance": item[1], "State": item[2], "County": item[3], "Rating": ratings[check_rating]["Rating"]})
            else:
                temp_output.append({"Distance": item[0], "Cos_Distance": item[1], "State": item[2], "County": item[3], "Rating": 0})


        final_output = temp_output

    else:
        temp_output = newList[0:5]
        final_output = []

        for item in temp_output:
            cs = (item[2], item[1])
            if (cs in county_state or cs in ignore) and cs not in good_ratings:
                continue
            check_rating = str(item[3]) + ", " +  str(item[2])
            if check_rating in ratings.keys():
                final_output.append({"Distance": "N/A", "Cos_Distance": item[0], "State": item[1], "County": item[2], "Rating": ratings[check_rating]["Rating"]})
            else:
                final_output.append({"Distance": "N/A", "Cos_Distance": item[0], "State": item[1], "County": item[2], "Rating": 0})
    
        # Compute & print intralist similarity
        output_pairs = [(output["State"], output["County"]) for output in final_output]
        get_intralist_similarities(output_pairs)

    return final_output

def get_intralist_similarities(in_list):
    dataset = pd.read_csv("data.csv")
     # Computing intralist similarity
    output_list = [] 
    for pair in in_list:
        row = np.array(dataset[(dataset["State"] == pair[0]) & (dataset["Area_name"] == pair[1])])[0]
        row = row[3:]

        for i in range(len(row)):
            if type(row[i]) == str:
                if "," in row[i]:
                    row[i] = int(row[i].replace(",", ""))
                else:
                    row[i] = int(row[i])
            else:
                row[i] = round(row[i])

        output_list.append(row)
    output_list = np.array(output_list)
    
    print("Intralist Distances:")
    print("--------------------------------")
    # Create pairwise cosine distance matrix
    for metric in ['cosine', 'euclidean', 'manhattan']:
        dists = pairwise.pairwise_distances(output_list, metric=metric)
        print(f"{dists.sum()/(5*5 - 5)}") # sum distance over all - diagonal
    print("--------------------------------")

if __name__ == "__main__":
    # Compute output similarities
    # scenario1 = [('GA', 'Fulton County'), ('GA', 'Gwinnett County'), ('GA', 'DeKalb County'), ('GA', 'Cobb County'), ('SC', 'Greenville County')]
    # scenario2 = [('GA', 'Paulding County'), ('GA', 'Douglas County'), ('GA', 'Coweta County'), ('GA', 'Henry County'), ('GA', 'Newton County')]
    # scenario3 = [('AK', 'Sitka City and Borough'), ('AK', 'Haines Borough'), ('AK', 'Denali Borough'), ('AK', 'Skagway Municipality'), ('AK', 'Yakutat City and Borough')]
    # scenario4 = [('TX', 'Loving County'), ('AK', 'Haines Borough')]
    # scenario5 = [('OH', 'Geauga County'), ('VA', 'Hanover County'), ('VA', 'Frederick County'), ('OH', 'Knox County'), ('VA', 'Bedford County')]
    # get_intralist_similarities(scenario1)
    # get_intralist_similarities(scenario2)
    # get_intralist_similarities(scenario3)
    # get_intralist_similarities(scenario4)
    # get_intralist_similarities(scenario5)
    
    application.run(host='127.0.0.1', port=5000, debug=False)

