# breathingApp
API's:
authentication:(method: POST)
  1. signup: /api/users/signup --onSuccess(201), onExistingUser(409) --body({name, email, password, passwordConfirm})
  2. login: /api/users/login --onSuccess(200), onInvalidCredentials(401) --body({email, password})
  3. forgotpassword: /api/users/forgotPassword  --pending
  4. signup & login response format:
    ![alt text](https://github.com/milanpatel1604/breathing-app-final-master/blob/master/ss/signup%20login%20response%20format.PNG)
  
  
meditation:
  1. all tracks of meditation: /api/meditation/allMeditationTracks -- onSuccess(200), onError(400) --(method: GET) 
  2. upload meditation track: /api/meditation/upload/trackID --replace trackID with audio _id. --onSuccess(201), onError(400) --(method: POST) 
  3. download meditation track: /api/meditation/download/trackID  --fetching perticular audio file from db - replace trackID in url with _id in database -- onSuccess(206), noHeadersFound(400), noAudioFound(404), onError(401) --(method: GET) 
  
  
sleep:
  1. all tracks of sleep: /api/sleep/allSleepTracks -- onSuccess(200), onError(400) --(method: GET) 
  2. upload sleep track: /api/sleep/upload/trackID --trackID --replace trackID with audio _id. --onSuccess(201), onError(400) --(method: POST) 
  3. download sleep track: /api/sleep/download/trackID  --fetching perticular audio file from db - replace trackID in url with _id in database -- onSuccess(206), noHeadersFound(400), noAudioFound(404), onError(401) --(method: GET) 
  
  
relax:
  1. all tracks of relax: /api/relax/allRelaxTracks -- onSuccess(200), onError(400) --(method: GET) 
  2. upload relax track: /api/relax/upload/trackID --trackID --replace trackID with audio _id. --onSuccess(201), onError(400) --(method: POST) 
  3. download relax track: /api/relax/download/trackID  --fetching perticular audio file from db - replace trackID in url with _id in database -- onSuccess(206), noHeadersFound(400), noAudioFound(404), onError(401) --(method: GET) 

* allTracks details Format:
  ![alt text](https://github.com/milanpatel1604/breathing-app-final-master/blob/master/ss/allTracksFormat.PNG)
* audio details upload format: (method: POST) body-as shown in image below 
  ![alt text](https://github.com/milanpatel1604/breathing-app-final-master/blob/master/ss/uploadAudioDetailsFormat.PNG)
