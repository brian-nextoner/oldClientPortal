app.controller('profileCtrl', function($scope, $rootScope, $http, fac_session) {
    var handleSuccess = function(data, status) {
        $scope.user = data.user;
        $scope.coName = data.coName;
        $scope.coKey = data.coKey;
        $scope.fname = data.fName;
        $scope.lname = data.lName;
        $scope.username = data.username;
        $scope.pwd = data.pwd;
        $scope.position = data.position;
        $scope.mobile = data.mobile;
        $scope.office = data.office;
        $scope.ext = data.ext;
        $scope.addr1 = data.addr1;
        $scope.pwd = data.pwd;
        $scope.addr1 = data.addr1;
        $scope.addr2 = data.addr2;
        $scope.city = data.city;
        $scope.state = data.state;
        $scope.zip = data.zip;
        $scope.userKey = data.userKey;
        
        $scope.postTest = function() {
            var lol = {
                userKey: $scope.userKey,
                fname: $scope.fname,
                lname: $scope.lname,
                username: $scope.username,
                password: $scope.pwd,
                position: $scope.position,
                mobile: $scope.mobile,
                office: $scope.office,
                ext: $scope.ext,
                addr1: $scope.addr1,
                addr2: $scope.addr2,
                city: $scope.city,
                state: $scope.state,
                zip: $scope.zip,
                coName: $scope.coName,
            }
            console.log(lol)
            
            $http.post('/api/user/customer/updateProfile', lol).success(function(data) {
                $rootScope.currentUser = data;
                
                swal('Success', 'Your profile was updated successfully!', 'success');
            }).catch(function(data) {
                swal('Error', 'There was an error updating your profile', 'Error');
            });
        }
        
    };

    fac_session.getSession().success(handleSuccess);


    $(".typeahead").select2();
    
    var phoneFormat = function(num){
        var number = num;
        var len = number.len
        return(len);
    }
    
    
    
    $scope.states = [
        {
            "name": "Alabama",
            "abbreviation": "AL"
        },
        {
            "name": "Alaska",
            "abbreviation": "AK"
        },
//        {
//            "name": "American Samoa",
//            "abbreviation": "AS"
//        },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
        },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
        },
        {
            "name": "California",
            "abbreviation": "CA"
        },
        {
            "name": "Colorado",
            "abbreviation": "CO"
        },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
        },
        {
            "name": "Delaware",
            "abbreviation": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
        },
//        {
//            "name": "Federated States Of Micronesia",
//            "abbreviation": "FM"
//        },
        {
            "name": "Florida",
            "abbreviation": "FL"
        },
        {
            "name": "Georgia",
            "abbreviation": "GA"
        },
//        {
//            "name": "Guam",
//            "abbreviation": "GU"
//        },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
        },
        {
            "name": "Idaho",
            "abbreviation": "ID"
        },
        {
            "name": "Illinois",
            "abbreviation": "IL"
        },
        {
            "name": "Indiana",
            "abbreviation": "IN"
        },
        {
            "name": "Iowa",
            "abbreviation": "IA"
        },
        {
            "name": "Kansas",
            "abbreviation": "KS"
        },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
        },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
        },
        {
            "name": "Maine",
            "abbreviation": "ME"
        },
//        {
//            "name": "Marshall Islands",
//            "abbreviation": "MH"
//        },
        {
            "name": "Maryland",
            "abbreviation": "MD"
        },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
        },
        {
            "name": "Michigan",
            "abbreviation": "MI"
        },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
        },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
        },
        {
            "name": "Missouri",
            "abbreviation": "MO"
        },
        {
            "name": "Montana",
            "abbreviation": "MT"
        },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
        },
        {
            "name": "Nevada",
            "abbreviation": "NV"
        },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
        },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
        },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
        },
        {
            "name": "New York",
            "abbreviation": "NY"
        },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
        },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
        },
//        {
//            "name": "Northern Mariana Islands",
//            "abbreviation": "MP"
//        },
        {
            "name": "Ohio",
            "abbreviation": "OH"
        },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
        },
        {
            "name": "Oregon",
            "abbreviation": "OR"
        },
//        {
//            "name": "Palau",
//            "abbreviation": "PW"
//        },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
        },
//        {
//            "name": "Puerto Rico",
//            "abbreviation": "PR"
//        },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
        },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
        },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
        },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
        },
        {
            "name": "Texas",
            "abbreviation": "TX"
        },
        {
            "name": "Utah",
            "abbreviation": "UT"
        },
        {
            "name": "Vermont",
            "abbreviation": "VT"
        },
//        {
//            "name": "Virgin Islands",
//            "abbreviation": "VI"
//        },
        {
            "name": "Virginia",
            "abbreviation": "VA"
        },
        {
            "name": "Washington",
            "abbreviation": "WA"
        },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
        },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
        },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
        }
    ]

    

});