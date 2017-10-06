app.factory('fac_session', function($rootScope, $http, currentUser){
    return {
        getSession: function() {
            return $http.get('/session', {});
        }
    };
});