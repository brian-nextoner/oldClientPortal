app.controller('loginCtrl', function($scope, $http, $rootScope, $location) {
    $scope.login = function(user) {    
        $http.post('/login', user)
        .success(function(response) {
            $rootScope.currentUser = response;
            $rootScope.errorMessage = null;
            $location.url('/home');
        }).error(function(response) {
            swal('Error', 'We were unable to log you in', 'error');
            //$rootScope.errorMessage = 'There was an error logging in.'  
        });
    }
});