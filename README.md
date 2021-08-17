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

ref ID's:
section-

  1. Meditation: 6117d4f8b2531566f87ebf94
  2. Sleep: 6117d64fb2531566f87ebf95
  3. Relax: 6117d6eeb2531566f87ebf96


category:

  1. Meditation-
    1. Beginners: 6117dbafe2468d2e402abbb2
    2. Stress: 6117dbe5e2468d2e402abbb3

  2. Sleep-
    1. Music: 6117dd47e2468d2e402abbb6
    2. Stories: 6117dcf8e2468d2e402abbb5
    3. Mysterious: 6117dd61e2468d2e402abbb7

  3. Relax-
    1. Beginners: 6117dda2e2468d2e402abbb8
    2. Self-Calm: 6117ddb0e2468d2e402abbb9