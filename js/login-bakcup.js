var login = (function () {
    var loginUrl = "https://inbest-app-dev.firebaseapp.com/api/v1/login";

    function doLoginFacebook(token) {
        console.log('do login facebook');
        console.log(token);
        var login = {
            type: 'facebook',
            accessToken: token
        };
        $.ajax({
            type: "POST",
            url: loginUrl,
            data: login,
            success: function (response) {
                var token = response['token'];
                $('.js-response-call').text(token);
            },
            error: function (response) {
                var responseJSON = response['responseJSON'];
                $('.js-response-call').text(responseJSON['message']);

            }
        });
    }
    function mergeAuths(){
        // Get reference to the currently signed-in user
        var prevUser = firebase.auth().currentUser;
        // Sign in user with another account
        firebase.auth().signInWithCredential(credential).then(function(user) {
          console.log("Sign In Success", user);
          var currentUser = user;
          // Merge prevUser and currentUser data stored in Firebase.
          // Note: How you handle this is specific to your application

          // After data is migrated delete the duplicate user
          return user.delete().then(function() {
            // Link the OAuth Credential to original account
            return prevUser.link(credential);
          }).then(function() {
            // Sign in with the newly linked credential
            return firebase.auth().signInWithCredential(credential);
          });
        }).catch(function(error) {
          console.log("Sign In Error", error);
        });
    }

    function doLoginGoogle(token) {

        // Get reference to the currently signed-in user
        var prevUserPhone = firebase.auth().currentUser;

        var provider = new firebase.auth.GoogleAuthProvider();

        const googleCredential = provider.credential(token, null);
        console.log(googleCredential)
        firebase.auth().signInWithCredential(googleCredential).then((user) => {

            var currentUser = user;
            return user.delete().then(function() {
                // Link the OAuth Credential to original account
                return prevUserPhone.linkWithCredential(googleCredential);
            }).then(function(data) {
                // Sign in with the newly linked googleCredential
                return firebase.auth().signInWithCredential(googleCredential);
            }, function(data){
                console.log('error')
            });
            //user.getIdToken().then((userToken) => {
            //    console.log(userToken);
            //    console.log("googleCredential");
            //    console.log(googleCredential);
            //})
        }).catch(error => {

        });
        console.log('do login google');
        //console.log(token);
        //var login = {
        //    type: 'google',
        //    accessToken: token
        //};
        //$.ajax({
        //    type: "POST",
        //    url: loginUrl,
        //    data: login,
        //    success: function (response) {
        //        var token = response['token'];
        //        $('.js-response-call').text(token);
        //    },
        //    error: function (response) {
        //        var responseJSON = response['responseJSON'];
        //        $('.js-response-call').text(responseJSON['message']);
//
//        //    }
        //});
    }

//// Get reference to the currently signed-in user
//var prevUser = firebase.auth().currentUser;
//// Sign in user with another account
//firebase.auth().signInWithCredential(credential).then(function(user) {
//  console.log("Sign In Success", user);
//  var currentUser = user;
//  // Merge prevUser and currentUser data stored in Firebase.
//  // Note: How you handle this is specific to your application
//
//  // After data is migrated delete the duplicate user
//  return user.delete().then(function() {
//    // Link the OAuth Credential to original account
//    return prevUser.link(credential);
//  }).then(function() {
//    // Sign in with the newly linked credential
//    return firebase.auth().signInWithCredential(credential);
//  });
//}).catch(function(error) {
//  console.log("Sign In Error", error);
//});

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
            firebase.auth().signInWithCredential(credential).then((user) => {
              //console.log(result)
              var user = user;
            })
            //window.confirmationResult.confirm(code).then(function (result) {
            //  // User signed in successfully.
            //  console.log(result)
            //  var user = result.user;
            //  // ...
            //}).catch(function (error) {
            //    console.log(error)
            //  // User couldn't sign in (bad verification code?)
            //  // ...
            //});
        })    
        $("#sign-in-button3").click(function(){
        //var code = getCodeFromUserInput();
            var code = $('#code').val();
            // Get reference to the currently signed-in user
            var prevUserPhone = firebase.auth().currentUser;

            var provider = new firebase.auth.PhoneAuthProvider();

            var credential = firebase.auth.PhoneAuthProvider.credential(window.confirmationResult.verificationId, code);
            console.log(credential)
            firebase.auth().signInWithCredential(credential).then((user) => {

                var currentUser = user;
                return user.delete().then(function() {
                    // Link the OAuth Credential to original account
                    return prevUserPhone.linkWithCredential(credential);
                }).then(function(data) {
                    // Sign in with the newly linked credential
                    return firebase.auth().signInWithCredential(credential);
                }, function(data){
                    console.log('error')
                });
            })

        })    
    }

    return {
        init: init
    };
})();
