from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.ensemble import RandomForestClassifier

import pickle

def rf_TrainAndPred(sTrain, trainY, sTest, testY):
    try:
        rf = pickle.load(open("rf_model.pkl", "rb"))
    except (OSError, IOError) as e:
        rf = RandomForestClassifier(random_state=10).fit(sTrain,trainY)
        predY = rf.predict(sTest)

        print("Training accuracy : " + str(round(rf.score(sTrain, trainY), 5)))
        print("Model test accuracy : " + str(round(accuracy_score(y_true=testY, y_pred=predY), 5)))
        print("Model test precision : " + str(round(precision_score(y_true=testY, y_pred=predY, average='weighted'), 5)))
        print("Model test recall : " + str(round(recall_score(y_true=testY, y_pred=predY, average='weighted'), 5)))
        print("Model test f1 : " + str(round(f1_score(y_true=testY, y_pred=predY, average='weighted'), 5)))
        pickle.dump(rf, open("rf_model.pkl", "wb"))