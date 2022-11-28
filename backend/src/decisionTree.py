from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.tree import DecisionTreeClassifier

import pickle

def dt_TrainAndPred(sTrain, trainY, sTest, testY):
    try:
        dt = pickle.load(open("dt_model.pkl", "rb"))
    except (OSError, IOError) as e:
        dt = DecisionTreeClassifier(random_state=0).fit(sTrain, trainY)
        predY = dt.predict(sTest)

        print("Training accuracy : " + str(round(dt.score(sTrain, trainY), 5)))
        print("Model test accuracy : " + str(round(accuracy_score(y_true=testY, y_pred=predY), 5)))
        print("Model test precision : " + str(round(precision_score(y_true=testY, y_pred=predY, average='weighted'), 5)))
        print("Model test recall : " + str(round(recall_score(y_true=testY, y_pred=predY, average='weighted'), 5)))
        print("Model test f1 : " + str(round(f1_score(y_true=testY, y_pred=predY, average='weighted'), 5)))
        pickle.dump(dt, open("dt_model.pkl", "wb"))