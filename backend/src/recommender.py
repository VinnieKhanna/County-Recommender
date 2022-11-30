import pandas as pd
import numpy as np
from scipy.spatial import distance
from collections import OrderedDict


def recommender(city_name, weights, history):

    dataset = pd.read_csv("data.csv")

    avg = []

    for state, county in history:
        print(state, county)
        row = []
        # try:
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

    dist_list = {}

    print(avg)

    for index, row in dataset.iterrows():
        state = row['State']
        county = row['Area_name']
        # latitude = row['latitude']
        # longitude = row['longitude']

        row = row.drop("State")
        row = row.drop("Area_name")

        # dist_list[distance.cosine(avg, row)] = [state, county, latitude, longitude]

        for i in range(len(row)):
            if type(row[i]) == str:
                if "," in row[i]:
                    row[i] = int(row[i].replace(",", ""))
                else:
                    row[i] = int(row[i])
            else: 
                row[i] = round(row[i])

        row = row[1:]

        dist_list[distance.cosine(avg, row)] = [state, county]


    sorted_dictionary = OrderedDict(sorted(dist_list.items()))

    result = list(sorted_dictionary.items())

    print(result[:10])

if __name__ == "__main__":
    # history = [("FL", "Seminole County"), ("GA", 'Fulton County'), ("AL", "Bibb County"), ("CO", "Otero County"), ("AL", "Crenshaw County"), ("IA", "Davis County"), ("IN", "Scott County"), ("ND", "Benson County"), ("SD", "Hanson County")]

    history = [("FL", "Seminole County")]


    recommender("", "", history)
    
