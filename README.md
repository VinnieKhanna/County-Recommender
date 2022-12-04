## Setup Instructions
  1. Clone the GitHub repository: `git clone
	https://github.com/mknilesh/CS6220Workspace`
### Backend Setup
2. `cd CS6220WORKSPACE/backend/src`
3. `pip install -r requirements.txt` - if you get some dependency errors ignore them for now
4. `python application.py` - starts Flask server. 

### Frontend Setup
4. open new terminal
5. `cd CS6220WORKSPACE/frontend`
6. `npm install`
7. `npm run start` - starts up frontend at localhost:3000. 

## Firebase Setup
Everyone will need to make a credential file locally for firebase since it doesn't belong in version control. Just go to the project > settings > service accounts > generate new private key. Rename the downloaded file to `firebase-secrets.json` and move it to the `backend/src` directory.

<s> - Run the following command in the terminal:
	python3 install.py
- Afterwards, cd into the src folder using the following command:
	cd src

There are two options for the last steps:
- Option 1:
    - Run the following command in the terminal:
            python3 application.py
    - On your chrome browser, open the following link:
            http://127.0.0.1:5000

- Option 2:
    - Run the following command in the terminal:
            jupyter notebook kickstarterAnalyzer.ipynb
    - Run all the cells in the notebook
    - Next, type cmd+c (or cntrl+c for windows) in the terminal
    - Run the following command in the terminal:
            jupyter notebook webApp.ipynb
    - Run all the cells in the notebook
    - On your chrome browser, open the following link:
            http://127.0.0.1:5000 </s> 
