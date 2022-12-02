import pandas as pd
import numpy as np
import json

def clean_and_merge():
    education = pd.read_csv("Education.csv")
    education = education[["State", "Area name", "Percent of adults with less than a high school diploma, 2016-20", "Percent of adults with a high school diploma only, 2016-20", "Percent of adults completing some college or associate's degree, 2016-20", "Percent of adults with a bachelor's degree or higher 2016-20"]]
    education = education.rename({'Area name': 'Area_name'}, axis=1)

    poverty = pd.read_csv("PovertyEstimates.csv")
    poverty = poverty[["Stabr", "Area_name", "PCTPOVALL_2020"]]
    poverty = poverty.rename({'Stabr': 'State'}, axis=1)

    population = pd.read_csv("PopulationEstimates.csv")
    population = population[["State", "Area name", "Population 2020", "Population 2021"]]
    population = population.rename({'Area name': 'Area_name'}, axis=1)

    unemployment = pd.read_csv("Unemployment.csv")
    unemployment = unemployment[["State", "Area_name", "Median_Household_Income_2020", "Med_HH_Income_Percent_of_State_Total_2020", "Unemployment_rate_2020"]]


    unemployment["Area_name"]= unemployment["Area_name"].str.split(",", n = 1, expand = False)
    unemployment["Area_name"] = unemployment["Area_name"].str[0]


    test = pd.merge(education, poverty,  how='left', left_on=['State','Area_name'], right_on = ['State','Area_name'])

    test2 = pd.merge(test, population, how='left', left_on=['State','Area_name'], right_on = ['State','Area_name'])

    final_csv = pd.merge(test2, unemployment, how='left', left_on=['State','Area_name'], right_on = ['State','Area_name'])

    final_csv = final_csv.dropna()

    final_csv.to_csv("data.csv")

def get_states_and_counties():
    # Filter down full list of counties to only states, county names
    counties = pd.read_csv("data.csv")[["State", "Area_name"]]
    states = pd.unique(counties["State"])
    print(len(states))
    #return dataframe of unique state codes and lists of counties in each
    states_counties_df = counties.groupby("State").agg(list)
    states_counties_df.to_csv("States&Counties.csv")
    states_counties_json = json.loads(states_counties_df.to_json())["Area_name"]
    with open('States&Counties.json', 'w', encoding='utf-8') as f:
        json.dump(states_counties_json, f, ensure_ascii=False, indent=4)
    return states_counties_df


# clean_and_merge()
get_states_and_counties()


