import pandas as pd
import numpy as np
from scipy.spatial import distance
from collections import OrderedDict
import geopy.distance
import math
from operator import itemgetter



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
    #history = [("FL", "Seminole County"), ("GA", 'Fulton County'), ("AL", "Bibb County"), ("CO", "Otero County"), ("AL", "Crenshaw County"), ("IA", "Davis County"), ("IN", "Scott County"), ("ND", "Benson County"), ("SD", "Hanson County")]
    history = [{'state': 'FL', 'county': 'Seminole County', 'locationImp': 9}, {'state': 'GA', 'county': 'Fulton County', 'locationImp': 8}, {'state': 'AL', 'county': 'Bibb County', 'locationImp': 7}, {'state': 'CO', 'county': 'Otero County', 'locationImp': 5}, {'state': 'AL', 'county': 'Crenshaw County', 'locationImp': 3}, {'state': 'IA', 'county': 'Davis County', 'locationImp': 6},
    {'state': 'IN', 'county': 'Scott County', 'locationImp': 4}, {'state': 'ND', 'county': 'Benson County', 'locationImp': 7}, {'state': 'SD', 'county': 'Hanson County', 'locationImp': 3}]

    prefs = {"city": "Augusta", "costOfLiving": 5, "costOfLivingImp": 6, "educationImp": 0, "population": "10000", "populationImp": 5, "povertyImp": 1, "precipitationImp": 4, "temperature": "65", "temperatureImp": 1, "unemploymentImp": 6}

    
    recommendations = cosine_distance_calculator(history, prefs)


    
 