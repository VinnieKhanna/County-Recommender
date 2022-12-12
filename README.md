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
