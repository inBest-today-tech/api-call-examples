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
        });
    }

    return {
        init: init
    };
})();
