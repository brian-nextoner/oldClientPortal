var app = angular.module('app', ['ui.router', 'mgo-angular-wizard', 'angularPayments', 'ngDialog']);
app.value('sessionUser', {});
app.value('package', {
    name: 'nexToner Admin',
    version: '2.0.0',
});

//ROUTES GO HERE---------------------------------------------------------------------
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: 'views/home/home.html',
            controller: 'homeCtrl',
            resolve: {loginCheck: checkLogin}
        })
        .state('profile', {
            url: "/profile", //This is what we type into the URL
            templateUrl: 'views/profile/profile.html', //This is what we return when the above is entered into the URL
            controller: 'profileCtrl', //This controller is married to the view at the top and must match name of controller on *.js
            resolve: {loginCheck: checkLogin}
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login/login.html",
            controller: 'loginCtrl'
        })
    
});
//END ROUTES GO HERE---------------------------------------------------------------------

app.run(function($rootScope, $location, $window) {
    // initialise google analytics
    $window.ga('create', 'UA-97325640-1', 'auto');

    // record page view on each state change
    $rootScope.$on('$stateChangeSuccess', function (event) {
        $window.ga('send', 'pageview', $location.path());
    });
})

app.config(function($windowProvider) {
    var $window = $windowProvider.$get();
    $window.Stripe.setPublishableKey('pk_test_eKDAFeJoYiaXQUKRkMr5i9fG');
});

// HANDLE BRUTE FORCE SERVER KILLS-------------------------------------------------------



//---------------------------------------------------------------------------------------


var checkLogin = function($q, $timeout, $http, $location, $rootScope) {
    $http.get('/loggedin').success(function(user) {        
        $rootScope.errorMessage = null;
        if(user != 0) {
            //console.log(user);
            $rootScope.currentUser = user;
            app.sessionUser = user;
            $q.resolve();
        } else {
            $location.url('/login');
            $rootScope.errorMessage = 'There was an error logging in.';
            $q.reject(); 
        }
    }).error(function() {
        $rootScope.errorMessage = 'There was an error logging in.';
        deferred.reject(); 
        $location.url('/login')
    });
    return $q.promise;
};

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

