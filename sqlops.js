var color = require('colors');
var ip = require('retrieve-ip');
var sql = require('mssql');

var config = {
    user: 'nextoner',
    password: 'Pak1tUPnextoner',
    server: 'nextoner.nellnube.com\\nextoner16', // You can use 'localhost\\instance' to connect to named instance
    database: 'DB_nextoner1',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}


// var config = {
//     user: 'nextonerDB_user',
//     password: 'tmpPWD123',
//     server: 'nextonerdb.cnk2767l6vx0.us-west-2.rds.amazonaws.com', // You can use 'localhost\\instance' to connect to named instance
//     database: 'DB_nextoner1'
// }

var conn = new sql.Connection(config);
conn.connect();

//  ----------------------------------------------------------------------------------------- CUSTOMERS

var getAllCustomers = function(callback) {
    setTimeout(function() {
        callback('All customers');
    }, 100)
}
var getCustomer = function(id, callback) {
    setTimeout(function() {
        callback('Customer: ' + id);
    }, 100)
}

var getAlerts = function(req, callback){
    new sql.Request(conn)
    .input('userKey', sql.Int, req.user.userKey)
    .execute('z2_ck_alerts').then(function(recordsets) {
        var recordset = recordsets[0]
        callback(recordset)
    }).catch(function(err) {
        callback(err)
    });    
}

var removeAlert = function(jsonParams, req, callback){
    new sql.Request(conn)
    .input('userKey', sql.Int, req.user.userKey)
    .input('alertKey', sql.Int, jsonParams)
    .execute('z2_u_removeAlert').then(function(recordsets) {
        var recordset = recordsets[0]
        callback(recordset)
    }).catch(function(err) {
        callback(err)
    });    
}

//  ----------------------------------------------------------------------------------------- ORDERS

var getOrdersByMonth = function(jsonParams, req, callback) {
    var param = JSON.parse(jsonParams);
    

        new sql.Request(conn)
        .input('userKey', sql.Int, param[0])
        .input('moNum',   sql.Int, param[1])
        .input('yrNum',   sql.Int, param[2])
        .execute('ck_salesIndividualRep', function(err, recordsets) {
            if(!err) {
                var recordset = recordsets[0];
                callback(recordset);
            } else {
                callback(err);
            }
        });

}

var getAllOrders = function(callback) {
    setTimeout(function() {
        callback('All orders');
    }, 100)
}
var getOrders = function(id, callback) {
    setTimeout(function() {
        callback('Orders for rep: ' + id);
    }, 100)
}

var orderHistory = function(jsonParams, req, callback){
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.coKey != param[0] || req.user.userKey != param[1]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)) + color.white(' | Company ' + req.user.coKey + ' atempting to access ' + param[0]))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {
        

            new sql.Request(conn)
            .input('coKey', sql.Int, param[0])
            .input('userKey', sql.Int, param[1])
            .input('orderCnt', sql.Int, param[2])
            .execute('ck_OrderHistoryByCompany').then(function(recordsets) {
                var recordset = recordsets[0]
                callback(recordset)
            }).catch(function(err) {
                callback(err)
            });    
 
    }
}

var orderHistDtl = function(jsonParams, callback){
    new sql.Request(conn)
    .input('checkOutHdrKey', sql.Int, jsonParams)
    .execute('ck_orderDetailsOrig').then(function(recordsets) {
        var recordset = recordsets[0]
        callback(recordset)
    }).catch(function(err) {
        callback(err)
    });    
}


// ------------------------------------------------------------------------------------------------------------- CART

var getActiveCart = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.coKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)) + color.white(' | Company ' + req.user.coKey + ' atempting to access ' + param[0]))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {

            new sql.Request(conn)
            .input('coKey',   sql.Int, param[0])
            .execute('ck_cartList', function(err, recordsets) {
                if(!err) {
                    var recordset = recordsets[0];
                    callback(recordset);
                } else {
                    callback(err);
                }
            });

    }
}

var updateCart = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.coKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)) + color.white(' | Company ' + req.user.coKey + ' atempting to access ' + param[0]))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {

            new sql.Request(conn)
            .input('cartLineKey', sql.Int, param[2])
            .input('qty',   sql.Int, param[1])
            .input('coKey',   sql.Int, param[0])
            .execute('u_cartQty', function(err, recordsets) {
                if(!err) {
                    callback(recordsets)
                } else {
                    callback(err);
                }
            });

    }
}

var cartRemoveItem = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);

    if(req.user.coKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)) + color.white(' | Company ' + req.user.coKey + ' atempting to access ' + param[0]))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {

            new sql.Request(conn)
            .input('cartLineKey', sql.Int, param[1])
            .input('coKey',   sql.Int, param[0])
            .execute('u_cartRemoveItem', function(err, recordsets) {
                if(!err) {
                    callback(recordsets)
                } else {
                    callback(err);
                }
            });

    }
}

var addItem = function(jsonParams, req, callback) {
    var param = JSON.parse(jsonParams);

    if(req.user.coKey != param[0] || req.user.userKey != param[1]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)) + color.white(' | Company ' + req.user.coKey + ' atempting to access ' + param[0]))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {
            new sql.Request(conn)
            .input('coKey', sql.Int, param[0])
            .input('userKey',   sql.Int, param[1])
            .input('tonerKey',   sql.Int, param[2])
            .input('qty',   sql.Int, param[3])
            .execute('z2_iu_cartContent', function(err, recordsets) {
                if(!err) {
                    callback(recordsets)
                } else {
                    callback(err);
                }
            });

    }
}

var reorder = function(jsonParams,callback){    
    new sql.Request(conn)
            .input('checkOutHdrKey', sql.Int, jsonParams)
            .execute('ck_cartReorder', function(err, recordsets) {
                if(!err) {
                    callback(recordsets)
                } else {
                    callback(err);
                }
            });

}


// ------------------------------------------------------------------------------------------------------- COMPANY


var getMyCompany = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.userKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)) + color.white(' | User ' + req.user.userKey + ' atempting to access ' + param[0]))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {
 
            new sql.Request(conn)
            .input('userKey', sql.Int, param[0])
            .input('action',   sql.Int, 3)
            .input('coKey',   sql.Int, null)
            .execute('z2_ck_clientLast', function(err, recordsets) {
                if(!err) {
                    var recordset = recordsets[0];
                    callback(recordset);
                } else {
                    callback(err);
                }
            });
    }
}

var getMyPrinters = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.coKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)) + color.white(' | User ' + req.user.userKey + ' atempting to access ' + param[0]))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {
        
            new sql.Request(conn)
            .input('coKey',   sql.Int, param[0])
            .execute('index_deviceList', function(err, recordsets) {
                if(!err) {
                    var recordset = recordsets[0];
                    callback(recordset);
                } else {
                    callback(err);
                }
            });
 
    }
}

var getShippingAddress = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    new sql.Request(conn)
    .input('coKey', sql.Int, param)
    .execute('get_shippingAddressList', function(err, recordsets) {
        if(!err) {
            var recordset = recordsets[0];
            callback(recordset);
        } else {
            callback(err);
        }
    });
}

var getDefShippingAddress = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    new sql.Request(conn)
    .input('coKey', sql.Int, param)
    .execute('getDefShippingAddress', function(err, recordsets) {
        if(!err) {
            var recordset = recordsets[0];
            callback(recordset);
        } else {
            callback(err);
        }
    });
}




var addDeviceToCompany = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.coKey != param[0] || req.user.userKey != param[1]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {
       
            new sql.Request(conn)
            .input('userKey', sql.Int, param[1])
            .input('coKey', sql.Int, param[0])
            .input('deviceKey', sql.Int, param[2])
            .execute('z2_i_newCompanyDevice_2', function(err, recordsets) {
                if(!err) {
                    var recordset = recordsets[0];
                    callback(recordset);
                } else {
                    callback(err);
                }
            });

    }
}

var removeDeviceFromCompany = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.coKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {
       
            new sql.Request(conn)
            .input('coKey', sql.Int, param[0])
            .input('coDeviceKey', sql.Int, param[1])
            .execute('z2_u_deviceSetInactive', function(err, recordsets) {
                if(!err) {
                    var recordset = recordsets[0];
                    callback(recordset);
                } else {
                    callback(err);
                }
            });

    }
}

// ------------------------------------------------------------------------------------------------------ PRINTER

var requestNewDevice = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.userKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {

            new sql.Request(conn)
            .input('tonerKey', sql.Int, param[1])
            .input('userKey', sql.Int, param[0])
            .execute('i_RequestUpdateTonerZeroCost', function(err, recordsets) {
                if(!err) {
                    var recordset = recordsets[0];
                    callback(recordset);
                } else {
                    callback(err);
                }
            });

    }
}


// ------------------------------------------------------------------------------------------------------ TONER

var tonersForPrinter = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.coKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {

            new sql.Request(conn)
            .input('coKey', sql.Int, param[0])
            .input('deviceKey', sql.Int, param[1])
            .execute('z2_index_tonerForDevice', function(err, recordsets) {
                if(!err) {
                    var recordset = recordsets[0];
                    callback(recordset);
                } else {
                    callback(err);
                }
            });

    }
}

var requestPricing = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.userKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {

            new sql.Request(conn)
            .input('tonerKey', sql.Int, param[1])
            .input('userKey', sql.Int, param[0])
            .execute('i_RequestUpdateTonerZeroCost', function(err, recordsets) {
                if(!err) {
                    var recordset = recordsets[0];
                    callback(recordset);
                } else {
                    callback(err);
                }
            });

    }
}


// ------------------------------------------------------------------------------------------ GLOBAL
var getStateInfo = function(jsonParams, callback) {

        new sql.Request(conn)
        .input('state', sql.VarChar(20), jsonParams)
        .execute('z2_ck_stateList', function(err, recordsets) {
            if(!err) {
                var recordset = recordsets[0];
                callback(recordset);
            } else {
                callback(err);
            }
        });

}

var deviceSearch = function(jsonParams, callback) {
    new sql.Request(conn)
    .input('model', sql.VarChar(100), jsonParams)
    .execute('z2_ck_similarDeviceList', function(err, recordsets) {
        if(!err) {
            var recordset = recordsets[0];
            callback(recordset);
        } else {
            callback(err);
        }
    });
}

var makesAndModels = function(jsonParams, callback) {
    new sql.Request(conn)
    .input('mmAction', sql.Int, 1)
    .input('Make', sql.VarChar(50), null)
    .execute('MakesModels', function(err, recordsets) {
        if(!err) {
            var recordset = recordsets[0];
            callback(recordset);
        } else {
            callback(err);
        }
    });
}
var requestDevice = function(jsonParams, req, callback) {
    var userRs = req.user.recordset;
    var param = JSON.parse(jsonParams);
    
    if(req.user.userKey != param[0]) {
        console.log(color.red('Unauthorized Attempt to Access API from - ') + color.grey(ip(req)))
        callback('Unauthorized Attempt to Access API from ' + ip(req))
    } else {
        new sql.Request(conn)
        .input('userKey', sql.Int, param[0])
        .input('make', sql.VarChar(50), param[1])
        .input('model', sql.VarChar(50), param[2])
        .input('note', sql.VarChar(1000), param[3])
        .input('deviceKey', sql.Int,null)
        .input('requestType', sql.Int, null)
        .execute('i_deviceRequest', function(err, recordsets) {
            if(!err) {
                var recordset = recordsets[0];
                callback(recordset);
            } else {
                callback(err);
            }
        });
    }
}

// ------------------------------------------------------------------------------------------------ POST CALLS

var updateProfile = function(req, callback) {
    console.log(req.body)
        new sql.Request(conn)
        .input('clientKey', sql.Int, req.body.userKey)
        .input('username', sql.VarChar(50), req.body.username)
        .input('fname', sql.VarChar(25), req.body.fname)
        .input('lname', sql.VarChar(25), req.body.lname)
        .input('position', sql.VarChar(50), req.body.position)
        .input('mobile', sql.VarChar(20), req.body.mobile)
        .input('office', sql.VarChar(20), req.body.office)
        .input('ext', sql.VarChar(20), req.body.ext)
        .input('addr1', sql.VarChar(50), req.body.addr1)
        .input('addr2', sql.VarChar(50), req.body.addr2)
        .input('city', sql.VarChar(50), req.body.city)
        .input('stateID', sql.VarChar(20), req.body.state)
        .input('zip', sql.VarChar(20), req.body.zip)
        .input('coName', sql.VarChar(50), req.body.coName)  
        .input('pmtTerms', sql.Int, null)  
        .input('payShipping', sql.Int, null)  
        .input('payTax', sql.Int, null)  
        //.input('pwd', sql.VarChar(10), req.body.password)
        .execute('u_UserInfo', function(err, recordsets) {
            if(!err) {
                var recordset = recordsets[0];
                callback(recordset);
            } else {
                callback(err);
            }
        });

} 

var orderUpdateName = function(req, callback){
    console.log(req.body);
    new sql.Request(conn)
    .input('checkouthdrkey', sql.Int, req.body.checkOutHdrKey)
    .input('cartName', sql.VarChar(35), req.body.orderName)
    .input('cartDesc', sql.VarChar(100), req.body.orderDesc)
    .execute('u_cartNameDesc').then(function(recordsets) {
        var recordset = recordsets[0]
        callback(recordset)
    }).catch(function(err) {
        callback(err)
    });    
}

// GET

module.exports.getAllCustomers = getAllCustomers;
module.exports.getCustomer = getCustomer;
module.exports.getAlerts = getAlerts;
module.exports.removeAlert = removeAlert;

module.exports.getOrdersByMonth = getOrdersByMonth;
module.exports.getAllOrders = getAllOrders;
module.exports.getOrders = getOrders;
module.exports.orderHistory = orderHistory;
module.exports.orderHistDtl = orderHistDtl;



module.exports.getActiveCart = getActiveCart;
module.exports.updateCart = updateCart;
module.exports.cartRemoveItem = cartRemoveItem;
module.exports.addItem = addItem;
module.exports.reorder = reorder;

module.exports.getMyCompany = getMyCompany;
module.exports.getMyPrinters = getMyPrinters;
module.exports.getShippingAddress = getShippingAddress;
module.exports.getDefShippingAddress = getDefShippingAddress;
module.exports.addDeviceToCompany = addDeviceToCompany;
module.exports.removeDeviceFromCompany = removeDeviceFromCompany;

module.exports.requestNewDevice = requestNewDevice;

module.exports.tonersForPrinter = tonersForPrinter;
module.exports.requestPricing = requestPricing;
module.exports.requestDevice = requestDevice;

module.exports.getStateInfo = getStateInfo;
module.exports.deviceSearch = deviceSearch;
module.exports.makesAndModels = makesAndModels;


// POST 

module.exports.updateProfile = updateProfile;
module.exports.orderUpdateName = orderUpdateName;

