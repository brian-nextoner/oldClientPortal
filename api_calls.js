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
var preprocessor = function(accesstype, property, subproperty, jsonParams, req, callback) {
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
    var customer = function(accesstype, property, subproperty, jsonParams, req, callback){
        if( process.access === permissions.admin ) {
            if(subproperty != 0) {
                sql.getCustomer(subproperty, function(response){callback(response)});
            } else if(subproperty === 0) {
                sql.getAllCustomers(function(response){callback(response)});
            }

        } else if( process.access === permissions.rep ) {
            sql.getCustomer(subproperty, function(response){callback(response)})
        } else if( process.access === permissions.user ) {
            if(subproperty != 0) {
                if(subproperty === 'getAlerts') {
                    sql.getAlerts(req, function(response){callback(response)})
                } 
            }
        } else {
            callback(err[1]);
        }
        if(subproperty === 'removeAlert') {
            sql.removeAlert(jsonParams, req, function(response){callback(response)})
        }
    }

    var order = function(accesstype, property, subproperty, jsonParams, req, callback) {
        if( process.access === permissions.admin ) {
            if(subproperty != 0) {
                if(subproperty === 'getOrdersByMonth') {
                    sql.getOrdersByMonth(jsonParams, function(response){callback(response)})
                } 
            } else if(subproperty === 0) {
                sql.getAllOrders(function(response){callback(response)})
            }
        } else if( process.access === permissions.rep ) {
            if(subproperty != 0) {
                if(subproperty === 'getOrdersByMonth') {
                    sql.getOrdersByMonth(jsonParams, function(response){callback(response)})
                } 
            }
        } else if( process.access === permissions.user ) {
            if(subproperty != 0) {
                if(subproperty === 'orderHistory'){
                    sql.orderHistory(jsonParams,req,function(response){callback(response)})
                }else if(subproperty === 'orderHistDtl'){
                    sql.orderHistDtl(jsonParams,function(response){callback(response)})
                } else if(subproperty === 'orderUpdateName'){
                    sql.orderUpdateName(jsonParams,function(response){callback(response)})
                }
            }
        }else {
            callback(err[1]);
        }
    }
    
    var cart = function(accesstype, property, subproperty, jsonParams, req, callback) {
        if (process.access === permissions.user ) { //If accesstype === 'user'
            if(subproperty === 'getActiveCart') {
                sql.getActiveCart(jsonParams, req, function(response){callback(response)})
            } else if(subproperty === 'updateCart') {
                sql.updateCart(jsonParams, req, function(response){callback(response)})
            } else if(subproperty === 'cartRemoveItem') {
                sql.cartRemoveItem(jsonParams, req, function(response){callback(response)})
            } else if(subproperty === 'addItem') {
                sql.addItem(jsonParams, req, function(response){callback(response)})
            } else if(subproperty === 'reorder') {
                sql.reorder(jsonParams, function(response){callback(response)})
            } 
        }
    }
    
    var company = function(accesstype, property, subproperty, jsonParams, req, callback) {

        if (process.access === permissions.admin ) {
            if(subproperty != 0) {
                sql.getCompanies(subproperty, function(response){callback(response)})
            } else if(subproperty === 0) {
                sql.getAllCompanies(function(response){callback(response)})
            }
        } else if ( process.access === permissions.rep ) {
            sql.getCompanies(subproperty, function(response){callback(response)})
        } else if ( process.access === permissions.user ) {
            if(subproperty === 'getMyCompany') {
                sql.getMyCompany(jsonParams, req, function(response){callback(response)})
            } else if(subproperty === 'getMyPrinters') {
                sql.getMyPrinters(jsonParams, req, function(response){callback(response)})
            } else if(subproperty === 'getShippingAddress') {
                sql.getShippingAddress(jsonParams, req, function(response){callback(response)})
            } else if(subproperty === 'getDefShippingAddress') {
                sql.getDefShippingAddress(jsonParams, req, function(response){callback(response)})
            } else if(subproperty === 'addDevice') {
                sql.addDeviceToCompany(jsonParams, req, function(response){callback(response)})
            } else if(subproperty === 'removeDeviceFromCompany') {
                sql.removeDeviceFromCompany(jsonParams, req, function(response){callback(response)})
            }
        } else {
            callback(err[1]);
        }
    }
    
    var printer = function(accesstype, property, subproperty, jsonParams, req, callback) {
        if(subproperty === 'requestNewDevice') {
            sql.requestNewDevice(jsonParams, req, function(response){callback(response)})
        }
    }
    
    var toner = function(accesstype, property, subproperty, jsonParams, req, callback) {
        if (process.access === permissions.user ) {
            if(subproperty === 'tonersForPrinter') {
                sql.tonersForPrinter(jsonParams, req, function(response){callback(response)})
            }
        }
    }
    
    var global = function(accesstype, property, subproperty, jsonParams, req, callback) {
        if (process.access === permissions.user ) {
            if(subproperty === 'getStateInfo') {
                sql.getStateInfo(jsonParams, function(response){callback(response)})
            }
        }
        if(subproperty === 'deviceSearch') {
            sql.deviceSearch(jsonParams, function(response){callback(response)})
        }
        if(subproperty === 'requestPricing') {
            sql.requestPricing(jsonParams, req, function(response){callback(response)})
        }
        if(subproperty === 'makesAndModels') {
            sql.makesAndModels(jsonParams, function(response){callback(response)})
        }
        if(subproperty === 'requestDevice') {
            sql.requestDevice(jsonParams, req, function(response){callback(response)})
        }
    }


//PROPERTIES///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if(property === 'customer') {
        customer(accesstype, property, subproperty, jsonParams, req, function(response) {
            callback(response);
        });
    } else if (property === 'order') {
        order(accesstype, property, subproperty, jsonParams, req, function(response) {
            callback(response);
        });
    } else if (property === 'cart') {
        cart(accesstype, property, subproperty, jsonParams, req, function(response) {
            callback(response);
        });
    } else if (property === 'company') {
        company(accesstype, property, subproperty, jsonParams, req, function(response) {
            callback(response);
        });
    } else if (property === 'printer') {
        printer(accesstype, property, subproperty, jsonParams, req, function(response) {
            callback(response);
        });
    } else if (property === 'toner') {
        toner(accesstype, property, subproperty, jsonParams, req, function(response) {
            callback(response);
        });
    } else if (property === 'global') {
        global(accesstype, property, subproperty, jsonParams, req, function(response) {
            callback(response);
        });
    } else {
        callback(err[2])
    }
}
//PROPERTIES///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports.preprocessor = preprocessor;
