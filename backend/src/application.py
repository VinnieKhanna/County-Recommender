# %%
import os
import numpy as np
import pandas as pd
import pickle
import json
import requests
from flask import Flask, flash, redirect, render_template, request, Response, session, abort, url_for, jsonify
from flask_jwt import JWT, jwt_required, current_identity
from collections import Counter
import pickle
import ast
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Flask App
application = Flask(__name__, template_folder='html')

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
    if user and user.password.encode('utf-8') == password.encode('utf-8'):
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
# Test Frontend Connection
@application.route("/test")
def test():
    return "Hi from Flask server"

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
    username = request.form.username
    password = request.form.password
    # If username already exists in db
    if get_doc(collection = "users", doc_name = username) is not None:
        return Response("Duplicate username exists, try logging in?", status=409)
    else:
        db.collection('users').document(username).set({"password" : password})


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




# dataSrc1 = 'data/ks-projects-201612.csv'
# dataSrc2 = 'data/ks-projects-201801.csv'
# data = cleanNull(dataSrc1, dataSrc2)
# data, countryEncoder, categoryEncoder, mCategoryEncoder, currencyEncoder = getHeatMap(data)
# resX, resY = oversampling(data)
# sTrain,sTest,trainY,testY,scaler = splitTestTrainData(resX, resY)
# try:
#     dt = pickle.load(open("dt_model.pkl", "rb"))
# except (OSError, IOError) as e:
#     dt = DecisionTreeClassifier(random_state=0).fit(sTrain, trainY)
#     pickle.dump(dt, open("dt_model.pkl", "wb"))

# try:
#     rf = pickle.load(open("rf_model.pkl", "rb"))
# except (OSError, IOError) as e:
#     rf = RandomForestClassifier(random_state=10).fit(sTrain,trainY)
#     pickle.dump(rf, open("rf_model.pkl", "wb"))

# try:    
#     knn = pickle.load(open("knn_model.pkl", "rb"))
# except (OSError, IOError) as e:
#     knn = KNeighborsClassifier(n_neighbors=1).fit(sTrain, trainY)
#     pickle.dump(knn, open("knn_model.pkl", "wb"))

# config = {
#     "apiKey": "AIzaSyCTuA7_uI-IE8ebetQwcVlt6txTT9L10-A",
#     "authDomain": "county-recommender.firebaseapp.com",
#     "projectId": "county-recommender",
#     "storageBucket": "county-recommender.appspot.com",
#     "messagingSenderId": "513833026552",
#     "appId": "1:513833026552:web:74b69d7d8e5199c9a5cc0d",
#     "databaseURL": 'https://kickstarteranalyzer-default-rtdb.firebaseio.com/'
# }
  
#   measurementId: "G-RP5MPEVZ9E"
# firebase = pyrebase.initialize_app(config)
# auth = firebase.auth()
# db = firebase.database()
# application.secret_key = 'secret'
# person = {"is_logged_in": False, "name": "", "email": "", "uid": ""}

# #Login
# @application.route("/")
# def login():
#     return render_template("login.html")
# #Login
# @application.route("/restart")
# def restart():
#     return render_template("login.html")

# #Sign up/ Register
# @application.route("/signup")
# def signup():
#     return render_template("signup.html")

# #Welcome page
# @application.route("/welcome")
# def welcome():
#     global projects
#     projects = {}
#     if person["is_logged_in"] == True:
#         data = db.child("users").get()
#         try:
#             val = data.val()[person["uid"]]["projects"]
#         except:
#             reset = {"name": data.val()[person["uid"]]["name"], "email": data.val()[person["uid"]]["email"], "projects": ""}
#             db.child("users").child(person["uid"]).set(reset)
#             data = db.child("users").get()
#         if data.val()[person["uid"]]["projects"] is not None:
#             project_list = data.val()[person["uid"]]["projects"]
#         else:
#             project_list = {}
#         projects = project_list
#         return render_template("welcome.html", email = person["email"], name = person["name"], project = projects, user_id = person["uid"])
#     else:
#         return redirect(url_for('login'))

# #Analyze new project
# @application.route("/new")
# def new():
#     return render_template("index.html")

# #If someone clicks on login, they are redirected to /outcome
# @application.route("/outcome", methods = ["POST", "GET"])
# def outcome():
#     if request.method == "POST":
#         outcome = request.form
#         email = outcome["email"]
#         password = outcome["pass"]
#         try:
#             user = auth.sign_in_with_email_and_password(email, password)
#             global person
#             person["is_logged_in"] = True
#             person["email"] = user["email"]
#             person["uid"] = user["localId"]
#             data = db.child("users").get()
#             person["name"] = data.val()[person["uid"]]["name"]
#             return redirect(url_for('welcome'))
#         except:
#             flash("Error: Email and/or Password Incorrect.")
#             return render_template("login.html")
#     else:
#         if person["is_logged_in"] == True:
#             return redirect(url_for('welcome'))
#         else:
#             return render_template("login.html")

# #If someone clicks on register, they are redirected to /register
# @application.route("/register", methods = ["POST", "GET"])
# def register():
#     if request.method == "POST":
#         result = request.form
#         email = result["email"]
#         password = result["pass"]
#         name = result["name"]
#         try:
#             auth.create_user_with_email_and_password(email, password)
#             user = auth.sign_in_with_email_and_password(email, password)
#             global person
#             person["is_logged_in"] = True
#             person["email"] = user["email"]
#             person["uid"] = user["localId"]
#             person["name"] = name
#             data = {"name": name, "email": email, "projects": ""}
#             db.child("users").child(person["uid"]).set(data)
#             return redirect(url_for('welcome'))
#         except:
#             flash("Error: Invalid Values For Registration. Email may already exist.")
#             return render_template("signup.html")

#     else:
#         if person["is_logged_in"] == True:
#             return redirect(url_for('welcome'))
#         else:
#             return redirect(url_for('register'))

# @application.route('/logout')
# def logout():
#     session.pop('user')
#     return redirect('/')


# #Predict with Kickstarter ML Models
# def dt_Predictor(param):
#     predParam = np.array(param).reshape(1,10)
#     dt_res = dt.predict(predParam)
#     return dt_res[0]

# def rf_Predictor(param):
#     predParam = np.array(param).reshape(1,10)
#     rf_res = rf.predict(predParam)
#     return rf_res[0]

# def knn_Predictor(param):
#     predParam = np.array(param).reshape(1,10)
#     knn_res = knn.predict(predParam)
#     return knn_res[0]

# @application.route('/result', methods = ['POST'])
# def result():
#     try:
#         if request.method == 'POST':
#             predParam = list(request.form.values())
#             curr_project_name = predParam[0]
#             curr_project_name = str(curr_project_name)
#             curr_category = predParam[1]
#             curr_currency = predParam[3]
#             curr_goal = predParam[4]
#             curr_pledged = predParam[5]
#             curr_backers = predParam[6]
#             predParam[1] = categoryEncoder.transform(np.reshape(np.array(predParam[1]), (1,)))
#             predParam[2] = mCategoryEncoder.transform(np.reshape(np.array(predParam[2]), (1,)))
#             predParam[3] = currencyEncoder.transform(np.reshape(np.array(predParam[3]), (1,)))
#             predParam[7] = countryEncoder.transform(np.reshape(np.array(predParam[7]), (1,)))

#             if (float(curr_pledged) > 0):
#                 currency_url = "https://v6.exchangerate-api.com/v6/e9c5fe4e0b04214e21d74574/pair/" + curr_currency + "/USD/"+str(curr_pledged)
#                 response = requests.get(currency_url)
#                 pledged_in_usd = response.json()['conversion_result']
#                 predParam.append(pledged_in_usd)
#             else:
#                 predParam.append("0")

#             if (float(curr_goal) > 0):
#                 currency_url = "https://v6.exchangerate-api.com/v6/e9c5fe4e0b04214e21d74574/pair/" + curr_currency + "/USD/"+str(curr_goal)
#                 response = requests.get(currency_url)
#                 goal_in_usd = response.json()['conversion_result']
#                 predParam.append(goal_in_usd)
#             else:
#                 predParam.append("0")

#             predParam = [float(predParam[x]) for x in range(1, len(predParam))]
#             predParam = np.reshape(np.array(predParam), (1, -1))
#             predParam = scaler.transform(predParam)

#             dt_res = dt_Predictor(predParam)
#             rf_res = rf_Predictor(predParam)
#             knn_res = knn_Predictor(predParam)
#             res_arr = [dt_res, rf_res, knn_res]
#             counts = Counter(res_arr)
#             res = counts.most_common(1)[0][0]

#             if float(res) == 0 or float(res) == 1 or float(res) == 4 or float(res) == 5:
#                 pred = 'Failed'
#             elif float(res) == 2 or float(res) == 3:
#                 pred = 'Successful'

#             if (projects == ""):
#                 new = {curr_project_name : [pred, curr_category, curr_currency, curr_goal, curr_pledged, curr_backers]}
#                 db.child("users").child(person["uid"]).update({"projects": new})
#             else:
#                 projects[curr_project_name] = [pred, curr_category, curr_currency, curr_goal, curr_pledged, curr_backers]
#                 db.child("users").child(person["uid"]).update({"projects": projects})
#             return render_template("result.html", pred=pred)
#     except:
#         flash("Error: One or more values were not valid. Please try again.")
#         return render_template("index.html")

if __name__ == "__main__":
    application.run(host='127.0.0.1', port=5000, debug=False)

# %%
