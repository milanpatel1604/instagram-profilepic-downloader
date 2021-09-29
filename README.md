# breathingApp
API's:

---- every api should have user specific token in header= --headers(authorization:Bearer /*JWTtoken*/)-invalid_or_expired_token_in_headers(401)-login again for new token,  EXCEPT(signup, login, verify email, resend verify email otp, forgotpassword, resetpassword, login with goole, login with facebook)

authentication:(method: POST)
  1. signup: /api/users/signup --onSuccess(200), --onErrorSendingMail(500), onExistingUser(409) --body({name, email, password}) --after signup-onSuccess email with an otp is sent to user which is valid for 2 min
  2. resend verify email otp: /api/users/resendverifyEmailToken --body({email}) --onSuccess(200), --onErrorSendingMail(500), --after signup-onSuccess one more email with an otp is sent to user which is valid for 2 min
  3. verify email: /api/users/verifyEmail --body({email, token}) --onSuccess(201)+userdata, --onInvalid_or_onTokenExpired(400)
  4. login: /api/users/login  --body({email, password}), --onSuccess(200), onNoUserFoundWithEmail(404), onIncorrectPassword(401), unVerifiedEmail(402)-fetch api/users/resendverifyEmailToken with email in body to send otp and send otp to api/users/verifyEmail
  5. checkLogin: /api/users/checkLogin --headers(authorization:Bearer /*JWTtoken*/), --onSuccess(200), --onTokenExpire(500) redirect to login
  6. forgotpassword: /api/users/forgotPassword  --body(email) --onNoUserFound(404), --onErrorSendingMail(500) --after onSuccess email with an otp is sent to user which is valid for 2 min
  7. resetpassword: /api/users/resetPassword --body({token, password}) --onSuccess(200)+userdata --onInvalid_or_onTokenExpired(400)
  8. login with google: /api/users/loginWithGoogle  --body({token}), --onSuccess(200)+userdata, --onGoogleApiError(401), onDatabaseError(400)
  9. login with facebook: /api/users/loginWithFacebook --body({access_token, user_id, email, name}), --onSuccess(200)+userdata, onDatabaseError(400)

userspecific:
  1. update or change password: /api/users/updateMyPassword --body({passwordCurrent, password}), --headers(authorization:Bearer /*JWTtoken*/), --onSuccess(200), --onWrongPasswordCurrent(402), method(post)
  2. update or change name: /api/users/updateMe --body({name}), --headers(authorization:Bearer /*JWTtoken*/)-invalid_or_expired_token_in_headers(401)-login again for new token, --onSuccess(200), method(post)
  3. get user_preferences: /api/users/getUserPreferences --headers(authorization:Bearer /*JWTtoken*/)-invalid_or_expired_token_in_headers(401)-login again for new token. --onError(400), --onSuccess(200), method(get)
  4. update user_preferences: /api/users/updateUserPreferences --body({ default_app_language, dark_mode, notifications_active, DND_active}), --headers(authorization:Bearer /*JWTtoken*/)-invalid_or_expired_token_in_headers(401)-login again for new token. --onError(400), --onSuccess(200), method(post)
  5. get user_sessions: /api/users/getUserSessions --headers(authorization:Bearer /*JWTtoken*/)-invalid_or_expired_token_in_headers(401)-login again for new token. --onError(400), --onSuccess(200), method(get)
  6. update user_sessions: /api/users/updateUserSessions --body({ default_app_language, dark_mode, notifications_active, DND_active}), --headers(authorization:Bearer /*JWTtoken*/)-invalid_or_expired_token_in_headers(401)-login again for new token. --onError(400), --onSuccess(200), method(post)
  7. moodchart: /api/users/addUserMood --onSuccess(200), method(post), requirements (mood: Amazing or Happy or Okay or Confused or Sad), --headers(authorization : Bearer /*JWTtoken*/)

meditation:
  1. all tracks of meditation: /api/meditation/allMeditationTracks -- onSuccess(200), onError(400) --(method: GET) 
  2. categorized meditation tracks: /api/meditation/categorizedMeditationTracks -- onSuccess(200), onError(400) --(method: GET) 
  3. get trackurl and desc -- /api/meditation/getMeditationTrack/:track_id -- onSuccess(200), onError(400) --(method: GET)
  4. (user specific) add track to favorite: /api/meditation/addMeditationFavorite/ -- onSuccess(201) -- (method: POST), body(user_id= user_id, track_id= track_id)
  5. (user specific) get all user favorite tracks: /api/meditation/getMeditationFavorite/:user_id -- onSuccess(200) -- (method: GET)
  6. (user specific) remove a track from favorite: /api/meditation/removeMeditationFavorite/ -- onSuccess(202) -- (method: POST), body(user_id= user_id, track_id= track_id)
  
sleep:
  1. all tracks of sleep: /api/sleep/allSleepTracks -- onSuccess(200), onError(400) --(method: GET)
  2. categorized sleep tracks: /api/sleep/categorizedSleepTracks -- onSuccess(200), onError(400) --(method: GET) 
  3. get trackurl and desc -- /api/sleep/getSleepTrack/:track_id -- onSuccess(200), onError(400) --(method: GET)
  4. (user specific) add track to favorite: /api/sleep/addSleepFavorite/ -- onSuccess(200) -- (method: POST), requirements(user_id= user_i, track_id= track_id)
  5. (user specific) get all user favorite tracks: /api/sleep/getSleepFavorite/:user_id -- onSuccess(200) -- (method: GET)
  6. (user specific) remove a track from favorite: /api/sleep/removeSleepFavorite/ -- onSuccess(202) -- (method: POST), body(user_id= user_id, track_id= track_id)
  
relax:
  1. all tracks of relax: /api/relax/allRelaxTracks -- onSuccess(200), onError(400) --(method: GET) 
  2. categorized relax tracks: /api/relax/categorizedRelaxTracks -- onSuccess(200), onError(400) --(method: GET)
  3. get trackurl and desc -- /api/relax/getRelaxTrack/:track_id -- onSuccess(200), onError(400) --(method: GET)
  4. (user specific) add track to favorite: /api/relax/addRelaxFavorite/ -- onSuccess(200) -- (method: POST), requirements(user_id= user_i, track_id= track_id)
  5. (user specific) get all user favorite tracks: /api/relax/getRelaxFavorite/:user_id -- onSuccess(200) -- (method: GET)
  6. (user specific) remove a track from favorite: /api/relax/removeRelaxFavorite/ -- onSuccess(202) -- (method: POST), body(user_id= user_id, track_id= track_id)
  7. fetching all melody sounds of relax -- /api/relax/allRelaxMelodySounds --(method: GET), response(title, track_url)