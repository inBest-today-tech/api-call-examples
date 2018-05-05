# api-call-examples
Some examples for calls Inbest API
HOST: "http://inbest-app-dev.firebaseapp.buy.com"

### Login

##### Login with Facebook (And Register)
HTTP POST
Url: "https://inbest-app-dev.firebaseapp.com/api/v1/login"
Data: 
```
{
type: 'facebook',
accessToken: 'user access token'
}
```
Response: 
```
SUCCESS: 
{success: true, token: 'token'}
ERROR: 
{success: false, message: 'message'}
```

Full example in login.html and login.js

##### Login with Google (And Register)
 HTTP POST
 Url: "https://inbest-app-dev.firebaseapp.com/api/v1/login"
 Data: 
 ```
 {
 type: 'google',
 accessToken: 'user access token'
 }
 ```
 Response: 
 ```
 SUCCESS: 
 {success: true, token: 'token'}
 ERROR: 
 {success: false, message: 'message'}
 ```

### Get Profile
HTTP GET
Url: "https://inbest-app-dev.firebaseapp.com/api/v1/profile"
Header: "Authorization Bearer TokenFromLogin"
Response:
 ```
 SUCCESS: 
 {success: true, profile: 'profile json'}
 ERROR: 
 {success: false, message: 'message'}
 ```

