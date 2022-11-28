from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.neighbors import KNeighborsClassifier

import pickle

def knn_TrainAndPred(sTrain, trainY, sTest, testY):
    try:
        knn = pickle.load(open("knn_model.pkl", "rb"))
    except (OSError, IOError) as e:
        knn = KNeighborsClassifier(n_neighbors=1).fit(sTrain, trainY)
        predY = knn.predict(sTest)

        print("Training accuracy : " + str(round(knn.score(sTrain, trainY), 5)))
        print("Model test accuracy : " + str(round(accuracy_score(y_true=testY, y_pred=predY), 5)))
        print("Model test precision : " + str(round(precision_score(y_true=testY, y_pred=predY, average='weighted'), 5)))
        print("Model test recall : " + str(round(recall_score(y_true=testY, y_pred=predY, average='weighted'), 5)))
        print("Model test f1 : " + str(round(f1_score(y_true=testY, y_pred=predY, average='weighted'), 5)))
        pickle.dump(knn, open("knn_model.pkl", "wb"))