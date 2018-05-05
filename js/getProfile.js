var getProfile = (function () {
    var getProfileUrl = "https://inbest-app-dev.firebaseapp.com/api/v1/profile";

    function init() {
        $('.js-get-profile').on('click', function () {
            console.log('get profile');
            var jwtToken = $('.js-jwt-token').val().replace(/\s/g, '');
            console.log(jwtToken);
            $.ajax({
                type: "GET",
                url: getProfileUrl,
                headers: {
                    "Authorization": "Bearer " + jwtToken
                },
                success: function (response) {
                    console.log(response);
                    $('.js-response-call').text(JSON.stringify(response.profile));

                },
                error: function (response) {
                    console.log(response);
                    if(response.status === 403){
                        $('.js-response-call').text('Invalid token');
                    }

                }
            });
        });
    }

    return {
        init: init
    };
})();
