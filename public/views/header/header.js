app.controller('headerCtrl', function ($scope, $rootScope, $http, $location, currentUser) {
    $scope.logout = function () {
        $rootScope.currentUser = null;
        app.sessionUser = null;
        $http.post('/logout')
            .success(function () {
                $location.url('/login');
            })
    }

    var handleSuccess = function (data, status) {
        var GuserKey = data.userKey;
        var GuserType = data.userType;
        var GcoKey = data.coKey;
        var Gstate = data.state;
        
        if(data.len > 5) {
            $scope.fname = data.user.fName;
            $scope.lname = data.user.lName;
        }
        
       
        
    };

    currentUser.getSession().success(handleSuccess);

});

app.controller('liveSearchShellCtrl', function($scope, $http) {
    $scope.liveSearch = function(searchParam) {
        if(searchParam === '') {searchParam='HP'}

        $http.get('/api/user/global/deviceSearch/' + searchParam).success(function(data) {
            $scope.searchRtn = data;
        });

    }
});