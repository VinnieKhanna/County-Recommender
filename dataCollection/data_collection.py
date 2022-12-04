import pandas as pd
import numpy as np
import json
from collections import defaultdict

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

def get_county_wikipedias():
    wiki_df = pd.read_html(
        "https://en.wikipedia.org/wiki/List_of_United_States_counties_and_county_equivalents",
        extract_links="all"
        )
    counties_df = wiki_df[0].iloc[:, [0, 1]]
    counties_df["State"] = counties_df.iloc[:, 1].apply(lambda x: x[0])
    counties_df["County"] = counties_df.iloc[:, 0].apply(lambda x: x[0])
    counties_df["URL"] = counties_df.iloc[:, 0].apply(lambda x: f"https://en.wikipedia.org{x[1]}")
    counties_df = counties_df[["State", "County", "URL"]]
    counties_df.to_csv("CountyWikipedias.csv")

    # Transforming into nice format to key into
    counties_df = counties_df.groupby("State").agg(list)
    counties_dict = defaultdict(dict)
    def make_state_dict(x):
        counties_dict[x.name] = {county: url for county, url in zip(x[0], x[1])}
    counties_df.apply(lambda x: make_state_dict(x), axis=1)
    with open('CountyWikipedias.json', 'w', encoding='utf-8') as f:
        json.dump(counties_dict, f, ensure_ascii=False, indent=4)
    return counties_dict

def get_abbrevs():
    df = pd.read_csv("StateAbbreviations.csv")
    df = df.set_index('code')
    with open('abbreviations.json', 'w', encoding='utf-8') as f:
        json.dump(json.loads(df.to_json())["state"], f, ensure_ascii=False, indent=4)

# clean_and_merge()
# get_states_and_counties()
#get_county_wikipedias()
get_abbrevs()


