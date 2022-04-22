import matplotlib.pyplot as plt
import seaborn as sns
import pickle

from sklearn.metrics import confusion_matrix

def getModelPred(source, sTest):
    model = pickle.load(open(source, "rb"))
    predY = model.predict(sTest)
    return predY

def getConfusionMatrix(testY, predY):
    plt.figure(figsize=(10,10))
    matrix = confusion_matrix(y_true=testY, y_pred=predY)
    labels = ["canceled", "failed", "live", "successful", "suspended", "undefined"]
    sns.heatmap(matrix, fmt='2d', annot=True, cmap='Reds', xticklabels=labels, yticklabels=labels)
    plt.title('Confusion Matrix for Prediction Values')
    plt.xlabel('Prediction Value')
    plt.ylabel('True Value')
    plt.show()