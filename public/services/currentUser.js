app.factory('currentUser', function($rootScope, $http){
    return {
        getSession: function() {
            return $http.get('/session', {});
        }
    };
});
