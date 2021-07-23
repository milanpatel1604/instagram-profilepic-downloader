# breathingApp
API's:
authentication:(method: POST)
  1. signup: /api/users/signup --onSuccess(201), onExistingUser(409) --body({name, email, password, passwordConfirm})
  2. login: /api/users/login --onSuccess(200), onInvalidCredentials(401) --body({email, password})
  3. forgotpassword: /api/users/forgotPassword  --pending
  signup & login response format:
  ![alt text]()
  
  
meditation:(method: GET)
  1. all tracks of meditation: /api/meditation/allMeditationTracks -- onSuccess(200), onError(400)
  2. upload meditation track: /api/meditation/upload/trackName --replace trackName with audio file name in static file. --onSuccess(201), onError(400)
  3. download meditation track: /api/meditation/download/trackName  --fetching perticular audio file from db - replace trackName in url with filename in database -- onSuccess(200), noHeadersFound(400), noAudioFound(404), onError(401)
  
  
sleep:(method: GET)
  1. all tracks of sleep: /api/sleep/allSleepTracks -- onSuccess(200), onError(400)
  2. upload sleep track: /api/sleep/upload/trackName --replace trackName with audio file name in static file. --onSuccess(201), onError(400)
  3. download sleep track: /api/sleep/download/trackName  --fetching perticular audio file from db - replace trackName in url with filename in database -- onSuccess(200), noHeadersFound(400), noAudioFound(404), onError(401)
  
  
relax:(method: GET)
  1. all tracks of relax: /api/relax/allRelaxTracks -- onSuccess(200), onError(400)
  2. upload relax track: /api/relax/upload/trackName --replace trackName with audio file name in static file. --onSuccess(201), onError(400)
  3. download relax track: /api/relax/download/trackName  --fetching perticular audio file from db - replace trackName in url with filename in database -- onSuccess(200), noHeadersFound(400), noAudioFound(404), onError(401)
