import pandas as pd
import numpy as np

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
