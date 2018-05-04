# api-call-examples
Some examples for calls Inbest API

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
 

