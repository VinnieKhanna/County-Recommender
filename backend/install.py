import pip

def install(package):
    pip.main(['install', package])

if __name__ == '__main__':
    install('numpy')
    install('pandas')
    install('matplotlib')
    install('missingno')
    install('seaborn')
    install('imblearn')
    install('scikit-learn')
    install('scipy')
    install('flask')
    install('Authlib')
    install('Pyrebase4')