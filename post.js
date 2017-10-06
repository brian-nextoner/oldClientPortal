// API Handler for POST requests

var sql = require('./sqlops.js')

/*
 * NAME: preprocessor
 * PURPOSE : Processes api requests from Server.js
 *  PARAMS : accesstype - example: admin
 *           property - example: customers
 *           subproperty - example: id
 *           callback - Schedules the data return back into the callstack
 * RETURNS : If authenticated, returns a JSON with the applicable data.
 */

var preprocessor = function(accesstype, property, subproperty, req, callback) {
    var process = {
        access: accesstype ,
        property: property ,
        subproperty: subproperty
    }
    var permissions = {
        admin: 'admin' ,
        rep: 'rep',
        user: 'user'
    }
    var err = [
        nullEr = {
            status: '200'
        },
        access = {
            message: 'You are not authorized to request this API call.',
            status: '301',
            summary: '301 Unauthorized'
        },
        property_invalid = {
            message: 'The API property specified is invalid.',
            status: '404',
            summary: '404 Property not found.'
        }
    ]

  /*
   * NAME: customer
   * PURPOSE : When the API is given the property 'customer', this function determines
   *           the access type for the session user, determines if there is an associated subproperty
   *           in the URL, and then calls the appropriate SQL function from sqlops.js.
   *  PARAMS : accesstype - example: admin
   *           property - example: customers
   *           subproperty - example: id
   *           callback - Schedules the data return back into the callstack
   * RETURNS : JSON to function 'preprocessor'.
   *   NOTES :
   */
    var customer = function(accesstype, property, subproperty, req, callback){
        if(process.access === permissions.user) {
            if(subproperty != 0) {
                if(subproperty === 'updateProfile') {
                    sql.updateProfile(req, function(response) {
                        var newUser = response[0];
                        console.log(newUser);
                        req.login(newUser, function(err) {
                            if (err) {
                                callback(err);
                            }
                            callback(newUser)
                        })
                        //callback(response);
                    });
                }
            }
        }
    }

    var order = function(accesstype, property, subproperty, req, callback) {
        if(process.access === permissions.user) {
            if(subproperty != 0) {
                if(subproperty === 'orderUpdateName') {
                    sql.orderUpdateName(req, function(response) {
                        callback(response);
                    });
                }
            }
        }
    }
    
    var cart = function(accesstype, property, subproperty, req, callback) {

    }
    
    var company = function(accesstype, property, subproperty, req, callback) {

    }
    
    var printer = function(accesstype, property, subproperty, req, callback) {

    }
    
    var toner = function(accesstype, property, subproperty, req, callback) {

    }
    
    var global = function(accesstype, property, subproperty, req, callback) {
        
    }


//PROPERTIES///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if(property === 'customer') {
        customer(accesstype, property, subproperty, req, function(response) {
            callback(response);
        });
    } else if (property === 'order') {
        order(accesstype, property, subproperty, req, function(response) {
            callback(response);
        });
    } else if (property === 'cart') {
        cart(accesstype, property, subproperty, req, function(response) {
            callback(response);
        });
    } else if (property === 'company') {
        company(accesstype, property, subproperty, req, function(response) {
            callback(response);
        });
    } else if (property === 'printer') {
        printer(accesstype, property, subproperty, req, function(response) {
            callback(response);
        });
    } else if (property === 'toner') {
        toner(accesstype, property, subproperty, req, function(response) {
            callback(response);
        });
    } else if (property === 'global') {
        global(accesstype, property, subproperty, req, function(response) {
            callback(response);
        });
    } else {
        callback(err[2])
    }
}
//PROPERTIES///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports.preprocessor = preprocessor;
