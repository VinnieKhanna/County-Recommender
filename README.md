# Demo
To see a quick demo, feel free to watch the video one of our teammates kindly put together. You can also access the deployed site, just beware of the very long warmup time on first access (~2 min).
- Demo video: https://youtu.be/-uJTQd3eYrM
- Running site: https://county-recommender.azurewebsites.net/

# Development

> Assuming Python 3.8 and Node installed
## Setup Instructions
  1. Clone the GitHub repository: `git clone https://github.com/VinnieKhanna/County-Recommender`
### Backend Setup
2. `cd County-Recommender/backend`
3. `pip install -r requirements.txt` - may take a few minutes to resolve
4. `python app.py` - starts Flask server. 

### Frontend Setup
4. open new terminal
5. `cd County-Recommender/frontend`
6. `npm install`
7. `npm run start` - starts up frontend at localhost:3000. 

## Firebase Setup
Everyone will need to make a credential file locally for firebase since it doesn't belong in version control. Just go to the project > settings > service accounts > generate new private key. Rename the downloaded file to `firebase-secrets.json` and move it to the `backend` directory.

# Deployment
Deployed by 
1. building React into static output and serving with default Flask route.
2. deploying Flask app to Azure AppService container

