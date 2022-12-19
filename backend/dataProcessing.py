import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from collections import Counter
from imblearn.over_sampling import SMOTE
from sklearn.preprocessing import StandardScaler,LabelEncoder
from sklearn.model_selection import train_test_split

def cleanNull(source1, source2):
    data1 = pd.read_csv(source1)
    data1 = data1.drop(['exchange_rates_to_usd', 'exchange_rate_values'], axis=1)
    data2 = pd.read_csv(source2)
    data = pd.concat([data1, data2])
    data = data.drop_duplicates(subset=['name'])

    print("Null values before cleaning:")
    print(data.isnull().sum())
    
    data['usd pledged'].fillna(method='pad', inplace=True)
    data.dropna(axis=0, inplace=True)
    print("\nNull values after cleaning:")
    print(data.isnull().sum())

    return data

def getHeatMap(data):
    stateEncoder = LabelEncoder().fit(data['state'])
    data['state'] = stateEncoder.transform(data['state'])
    
    countryEncoder = LabelEncoder().fit(data['country'])
    data['country'] = countryEncoder.transform(data['country'])
    
    categoryEncoder = LabelEncoder().fit(data['category'])
    data['category'] = categoryEncoder.transform(data['category'])
    
    mCategoryEncoder = LabelEncoder().fit(data['main_category'])  
    data['main_category'] = mCategoryEncoder.transform(data['main_category'])
    
    currencyEncoder = LabelEncoder().fit(data['currency'])
    data['currency'] = currencyEncoder.transform(data['currency'])

    plt.figure(figsize=(12,6))
    sns.heatmap(data.corr(), annot=True, xticklabels=True, yticklabels=True)
    plt.show(block=False)
    plt.pause(3)
    plt.close()

    return data, countryEncoder, categoryEncoder, mCategoryEncoder, currencyEncoder

def oversampling(data):
    data.set_index(data['name'], inplace=True, drop=True)
    data.drop(['ID', 'name'], axis=1, inplace=True)

    x = np.asarray(data.drop(['state', 'deadline', 'launched'], axis=1))
    y = np.asarray(data['state']).reshape(-1,1)

    print("State value counts before using SMOTE : ")
    for k, cnt in Counter(data['state']).most_common():
        if k == 0:
            key = "canceled"
        if k == 1:
            key = "failed"
        if k == 2:
            key = "live"
        if k == 3:
            key = "successful"
        if k == 4:
            key = "suspended"
        if k == 5:
            key = "undefined"
        print("{}: {}".format(key,cnt))

    smote = SMOTE()
    resX, resY = smote.fit_resample(X=x, y=y)

    print("\nState value counts after using SMOTE : ")
    for k, cnt in Counter(resY).most_common():
        if k == 0:
            key = "canceled"
        if k == 1:
            key = "failed"
        if k == 2:
            key = "live"
        if k == 3:
            key = "successful"
        if k == 4:
            key = "suspended"
        if k == 5:
            key = "undefined"
        print("{}: {}".format(key,cnt))

    return resX, resY

def splitTestTrainData(resX, resY):
    trainX, testX, trainY, testY = train_test_split(resX, resY, test_size=0.2, random_state=0)
    scaler = StandardScaler().fit(trainX)
    sTrain = scaler.transform(trainX)
    sTest = scaler.transform(testX)

    print("Size of training data : " + str(sTrain.shape[0]))
    print("Size of testing data : " + str(sTest.shape[0]))

    return sTrain, sTest, trainY, testY, scaler