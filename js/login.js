var login = (function () {
    var loginUrl = "https://inbest-app-dev.firebaseapp.com/api/v1/login";

    function doLoginFacebook(token) {
        console.log('do login facebook');
        var provider = new firebase.auth.FacebookAuthProvider();
        const facebookCredential = provider.credential(token, null);
        firebase.auth().signInWithCredential(facebookCredential).then((user) => {
            var currentUser = user;
            var hasPhoneAuth = false;
            currentUser.providerData.forEach((e,i) => {
                if(e.providerId == 'phone'){
                    hasPhoneAuth = true;
                }
            })
            if(!hasPhoneAuth){
                loadPhoneAuth();
                $('#phone-auth').show();
            }
            user.getIdToken().then((userToken) => {
                $('.js-response-call').text(userToken);
            })
        }).catch(error => {

        });
    }
    // Recive phone credencial, and the user si registerd with facebook or google.
    // Merge authentications: the signed user with de credential given.
    function mergeAuths(credential){
        var prevUser = firebase.auth().currentUser;
        firebase.auth().signInWithCredential(credential).then((user) => {
            return user.delete().then(function() {
                console.log('step1')
                // Link the OAuth Credential to original account
                return prevUser.linkWithCredential(credential);
            }).then(function(data) {
                console.log('step2')
                // Sign in with the newly linked credential
                return firebase.auth().signInWithCredential(credential);
            }, function(data){
                console.log('error',data)
            });
            user.getIdToken().then((userToken) => {
                console.log(userToken);
                console.log("credential");
                console.log(credential);
            })
        }).catch(error => {

        });
    }
    function doLoginGoogle(token) {
        //var prevUserPhone = firebase.auth().currentUser;
        var provider = new firebase.auth.GoogleAuthProvider();
        const googleCredential = provider.credential(token, null);
        firebase.auth().signInWithCredential(googleCredential).then((user) => {
            var currentUser = user;
            var hasPhoneAuth = false;
            currentUser.providerData.forEach((e,i) => {
                if(e.providerId == 'phone'){
                    hasPhoneAuth = true;
                }
            })
            if(!hasPhoneAuth){
                loadPhoneAuth();
                $('#phone-auth').show();
            }
            user.getIdToken().then((userToken) => {
                $('.js-response-call').text(userToken);
            })
        }).catch(error => {

        });
    }
    function loadPhoneAuth(){
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
          'size': 'invisible',
          'callback': function(response) {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // ...
          },
          'expired-callback': function() {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
          }
        });
        $("#sign-in-button").click(function(){
            var appVerifier = window.recaptchaVerifier;
            //var phoneNumberfran =    "+5491157059885";
            //var phoneNumberLeo = "+541130135600";
            var phoneNumber = $('#phone').val();
            firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              window.confirmationResult = confirmationResult;
            }).catch(function (error) {
              // Error; SMS not sent
            });
        })

        $("#sign-in-button2").click(function(){
        //var code = getCodeFromUserInput();
            var code = $('#code').val();
            var credential = firebase.auth.PhoneAuthProvider.credential(window.confirmationResult.verificationId, code);
            mergeAuths(credential);
        })
    }

    function init() {
        $('.js-login-social-facebook').on('click', function () {
            FB.getLoginStatus(function (loginStatus) {
                if (loginStatus.status == 'connected') {
                    var token = loginStatus['authResponse']['accessToken'];
                    doLoginFacebook(token);
                } else {
                    FB.login(function (loginStatus) {
                        if (loginStatus.status == 'connected') {
                            var token = loginStatus['authResponse']['accessToken'];
                            doLoginFacebook(token);
                        }
                    });
                }
            });
        });
        $('.js-login-social-google').on('click', function () {
            console.log('Login google');
            var authInstance = gapi.auth2.getAuthInstance();
            if (authInstance.isSignedIn.get()) {
                var token = authInstance.currentUser.get().getAuthResponse().id_token;
                doLoginGoogle(token);
            } else {
                authInstance.signIn()
                    .then(function () {
                        var token = authInstance.currentUser.get().getAuthResponse().id_token;
                        doLoginGoogle(token);
                    });
            }
        });

    }

    return {
        init: init
    };
})();
