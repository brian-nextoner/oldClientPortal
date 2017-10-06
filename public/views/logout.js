app.controller('ctrl_logout', function($scope, $http, $location, $rootScope) {
    $scope.logout = function() {
        $rootScope.currentUser = null;
        app.sessionUser = null;
        $http.post('/logout')
        .success(function() {
            $location.url('/login');
        })
    }
});