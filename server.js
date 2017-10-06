var myPort = 3011;
var http = require('http');
var express = require('express')
var socket = require('socket.io')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
//var jwt = require('jsonwebtoken');
var moment = require('moment')
var api = require('./api.js')
var session = require('express-session');
var get = require('./api_calls.js');
var post = require('./post.js');
var emailBodies = require('./emailBodies.js');
var logger = require('morgan');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var sql = require('mssql');
var _ = require('lodash');
var PrettyError = require('pretty-error');
var ip = require('retrieve-ip');
var color = require('colors');
var stripe = require('stripe')('sk_live_WlT4QrILjCuJc0Y6ouQX2naL');//sk_test_GOz1H9iFjJfwLSbFM3QUPrvS
var RateLimit = require('express-rate-limit');
var respawn = require('respawn');
var email 	= require("./node_modules/emailjs/email");
var server = email.server.connect({
    user: 'info@nextoner.com',
    password: 'Pak1tUPgmail',
    host: 'smtp.gmail.com',
    port: 465,
    ssl: true
});

var app = express();
var server = http.createServer(app);
var a = {
    user: 'nextoner',
    password: 'Pak1tUPnextoner',
    server: 'nextoner.nellnube.com\\nextoner16', // You can use 'localhost\\instance' to connect to named instance
    database: 'DB_nextoner1',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Force SSL
app.get('/', function(req, res, next) {
    if(process.env.PORT){
        if (req.secure) {
            next();
        } else {
            var url = 'https://' + req.get('host') + req.originalUrl
            res.redirect(301, url);
        }
    }else{
        next();
    }
});

var requestLimit = new RateLimit({
    windowMs: 10000, // 
    max: 1, // limit each IP to 10 requests per windowMs 
    delayMs: 0 
});

//Express middleware - used for API body and header parsing
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({ secret: 'secret', cookie: { maxAge: 864000000 } }));
app.use(cookieParser());
app.use(logger('short'));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

passport.use(new LocalStrategy(
    function(username, password, done) {
        sql.connect(a, function() {
            //console.log('Connected');
            new sql.Request()
            .input('username', sql.VarChar(50), username)
            .input('pwd',   sql.VarChar(50), password)
            .execute('signin', function(err, recordsets) {

                if(!err) {
                    //console.log(recordsets);
                    var recordset = recordsets[0][0];
                    if(_.isEmpty(recordset)) {
                        console.log(color.yellow('Failed Login Attempt'));
                        return done(null, false);
                    } else {
                        if(recordset.username === username && recordset.pwd === password) {
                            return done(null, recordset)
                        } else {
                            return done(null, false);
                        }
                    }
                } else {
                    console.log(err);
                    return done(err, false);
                }
            });


        });
    }
));
passport.serializeUser(function(user, done) {
   done(null, user);
});
passport.deserializeUser(function(user, done) {
   done(null, user);
});
app.get('/',passport.authenticate('local'), function(req, res){
  res.send('hello world');
});
// STRIPE Calls
app.post('/invoice', function(req, res) {
    var inv = req.body,
        amount = null;
    
    
    sql.connect(a, function() {
        new sql.Request()
        .input('coKey',   sql.Int, inv.coKey)
        .execute('u_CartHdrInfo', function(err, recordsets) {
            if(!err) {
                sql.connect(a, function() {
                    new sql.Request()
                    .input('coKey',   sql.Int, inv.coKey)
                    .execute('getCartHdrKey', function(err, recordsets) {
                        if(!err) {
                            var recordset = recordsets[0];
                            amount = recordset[0].cartTotal;
                            if(amount != null) {
                                sql.connect(a, function() {
                                    new sql.Request()
                                    .input('coKey', sql.Int, inv.coKey)
                                    .input('coUserKey', sql.Int, inv.userKey)
                                    .input('SHIPaddr1', sql.VarChar(200), inv.addr1)
                                    .input('SHIPaddr2',   sql.VarChar(100), inv.addr2)
                                    .input('SHIPcity',   sql.VarChar(100), inv.city)
                                    .input('SHIPmyState', sql.VarChar(100), inv.state)
                                    .input('SHIPzip', sql.VarChar(20), inv.zip)
                                    .input('pmtType', sql.Int, 2)
                                    .input('PONum', sql.VarChar(50), inv.poNum)
                                    .input('chrgToken', sql.VarChar(100), null)
                                    .execute('z2_i_checkout', function(err, recordsets) {
                                        if(!err) {
                                            var recordset = recordsets[0][0];
                                            var checkOutHdrKey = recordset.checkOutHdrKey;
                                            var repUsername = recordset.repUsername;
                                            var transactionId = recordset.transactionId;
                                            var createDate = recordset.createDate;

                                            var dueDate = new Date(createDate);
                                            var numberOfDaysToAdd = 10;
                                            dueDate.setDate(dueDate.getDate() + numberOfDaysToAdd);
                                            dueDate = dueDate.toDateString();

                                            var amountDue = '$' + amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                                            var fName = inv.fname;

                                            server.send({
                                                from: 'NexToner.com <info@nextoner.com>',
                                                to: inv.username,
                                                cc: 'info@nextoner.com, ' +repUsername,
                                                subject: 'nexToner Invoice for your purchase',
                                                attachment: 
                                                   [
                                                      {data: emailBodies.invoice(checkOutHdrKey, dueDate, amountDue, transactionId, fName) , alternative:true},

                                                   ]
                                            }, function (err, message) {
                                                console.log(err);
                                            });

                                            res.send(recordset);
                                        } else {
                                            res.send(err);
                                        }
                                    });
                                });
                            }
                        } else {
                            res.send(500)
                        }
                    });
                });                                                                                 
            }
        });
    });
                
});
app.post('/charge', function(req, res) {
    var stripeToken = req.body.stripeToken;
    var coKey = req.body.coKey;
    var userKey = req.body.userKey;
    var addr1 = req.body.addr1;
    var addr2 = req.body.addr2;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var amount = null;

    sql.connect(a, function() {
        new sql.Request()
        .input('coKey',   sql.Int, coKey)
        .execute('u_CartHdrInfo', function(err, recordsets) {
            if(!err) {
                sql.connect(a, function() {
                    new sql.Request()
                    .input('coKey',   sql.Int, coKey)
                    .execute('getCartHdrKey', function(err, recordsets) {
                        if(!err) {
                            var recordset1 = recordsets[0];
                            amount = Math.round(recordset1[0].cartTotal * 100);
                            var cartHdrKey = recordset1.cartHdrKey
                            if(amount != null) {
                                stripe.charges.create({
                                card: stripeToken,
                                currency: 'usd',
                                amount: amount
                                }, function(err, charge) {
                                    if (err) {
                                        //ERROR POINT #1
                                        server.send({
                                            from: 'NexToner.com <info@nextoner.com>',
                                            to: '2088604346@messaging.sprintpcs.com, brian.mccauley@nextoner.com',
                                            subject: 'ERROR_CARTHDRKEY_'+cartHdrKey+'_ERROR_'+err+'_ERRORPOINT_1',
                                        });
                                        res.send(500, err);
                                    } else {
                                        sql.connect(a, function() {
                                            new sql.Request()
                                            .input('coKey', sql.Int, coKey)
                                            .input('coUserKey', sql.Int,userKey)
                                            .input('SHIPaddr1', sql.VarChar(200), addr1)
                                            .input('SHIPaddr2',   sql.VarChar(100), addr2)
                                            .input('SHIPcity',   sql.VarChar(100), city)
                                            .input('SHIPmyState', sql.VarChar(100), state)
                                            .input('SHIPzip', sql.VarChar(20), zip)
                                            .input('pmtType', sql.Int, 1)
                                            .input('PONum', sql.VarChar(50), null)
                                            .input('chrgToken', sql.VarChar(100), charge.id)
                                            .execute('z2_i_checkout', function(err, recordsets) {
                                                if(!err) {
                                                    var recordset = recordsets[0][0];
                                                    var checkOutHdrKey = recordset.checkOutHdrKey;
                                                    var repUsername = recordset.repUsername;
                                                    var transactionId = recordset.transactionId;
                                                    var createDate = recordset.createDate;
                                                    var dueDate = new Date(createDate);
                                                    var numberOfDaysToAdd = 10;
                                                    dueDate.setDate(dueDate.getDate() + numberOfDaysToAdd);
                                                    dueDate = dueDate.toDateString();
                                                    var amountDue = '$' + recordset1[0].cartTotal.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                                                    //var fName = inv.fname;
                                                    server.send({
                                                        from: 'NexToner.com <info@nextoner.com>',
                                                        to: '2088604346@messaging.sprintpcs.com, brian.mccauley@nextoner.com',
                                                        subject: 'Order# ' + checkOutHdrKey + ' Placed Online',
                                                        attachment: 
                                                           [
                                                              {data:'ONLINE Order#' + checkOutHdrKey, alternative:true},
                                                           ]
                                                    });
                                                    server.send({
                                                        from: 'NexToner.com <info@nextoner.com>',
                                                        to: req.user.username,
                                                        cc: 'info@nextoner.com, ' + repUsername,
                                                        subject: 'nexToner Invoice for your purchase',
                                                        attachment: 
                                                           [
                                                              {data: emailBodies.invoice(checkOutHdrKey, dueDate, amountDue, transactionId, null), alternative:true},
                                                           ]
                                                    }, function (err, message) {
                                                        console.log(err);
                                                    });
                                                    res.send(charge);
                                                } else {
                                                     //ERROR POINT #1
                                                    server.send({
                                                        from: 'NexToner.com <info@nextoner.com>',
                                                        to: '2088604346@messaging.sprintpcs.com, brian.mccauley@nextoner.com',
                                                        subject: 'ERROR_ORDER_' + checkOutHdrKey + '_ERROR_'+err+'_ERRORPOINT_1',
                                                    });
                                                    res.send(err);
                                                }
                                            });
                                        });
                                    }
                                });
                            } else {
                                //ERROR POINT #2-- Order amount returned as NULL
                                server.send({
                                    from: 'NexToner.com <info@nextoner.com>',
                                    to: '2088604346@messaging.sprintpcs.com, brian.mccauley@nextoner.com',
                                    subject: 'ERROR_CARTHDRKEY_'+cartHdrKey+'_ERROR_'+err+'_ERRORPOINT_2',
                                });
                                res.send('Error')
                            }
                        } else {
                            //ERROR POINT #3
                            server.send({
                                from: 'NexToner.com <info@nextoner.com>',
                                to: '2088604346@messaging.sprintpcs.com, brian.mccauley@nextoner.com',
                                subject: 'ERROR_CARTHDRKEY_'+cartHdrKey+'_ERROR_'+err+'_ERRORPOINT_1',
                            });
                            console.log(err);
                        }
                    });
                });
            } else {
                //ERROR POINT #4
                server.send({
                    from: 'NexToner.com <info@nextoner.com>',
                    to: '2088604346@messaging.sprintpcs.com, brian.mccauley@nextoner.com',
                    subject: 'ERROR_CARTHDRKEY_'+cartHdrKey+'_ERROR_'+err+'_ERRORPOINT_1',
                });
            }
        });
    });
        
});
app.get('/chargecheck/:token', function (req, res) {
    var token = req.params.token
    stripe.charges.retrieve(token,function(err, charge) {
            res.send(charge);
        }
    );
});

/* LOGIN HANDLERS for GLOBAL*/
app.post('/login', passport.authenticate('local'), function(req, res) {
    console.log(color.green('New login from: ') + color.white(ip(req)) + ' - ' + color.grey(req.user.username));
    res.json(req.user);
});
app.post('/logout', function(req, res) {
    console.log(color.red('Logout from: ') + color.white(ip(req)) + ' - ' + color.grey(req.user.username));
    req.logOut();
    res.send(200);
});
app.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});
app.get('/session', function(req, res) {
    //console.log(req.user);
    if(req.user!=null) {
        new sql.Request()
        .input('username', sql.VarChar(50), req.user.username)
        .input('pwd',   sql.VarChar(50), req.user.pwd)
        .execute('signin', function(err, recordsets) {
            if(!err) {
                var newUser = recordsets[0][0];
                req.login(newUser, function(err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(newUser)
                    }
                })
            } else {
                res.send(err);
            }
        });       
        
        //res.send(req.user);
    } else {
        res.send(null);
    }
});
/* END LOGIN HANDLER

START API HANDLER*/
function requireLogin(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.redirect("/");
  }
}

function usertype(req, callback) {
    if(req.user!=null) {
        callback(req.user);
    } else {
        callback(null);
    }
}

// API Interstate -- redirect all unauthorized requests
var permissions = [
    {admin : 'Admin', userType: 30},
    {rep: 'Rep', userType: 20},
    {user: 'User', userType: 10}
]

app.all("/api/*", requireLogin, function(req, res, next) {
    console.log(color.yellow('Accessing API') + ' - ' + color.grey(req.user.username));
    next();
});
app.all('/api/admin/*', function(req, res, next) {
    usertype(req, function(response) {
        if(response.userType === permissions[0].userType) {
            next();
        } else {
            res.redirect("/");
        }
    });
});
app.all('/api/rep/*', function(req, res, next) {
    usertype(req, function(response) {
        if(response.userType === permissions[1].userType) {
            next();
        } else {
            res.redirect("/");
        }
    });
});
app.all('/api/user/*', function(req, res, next) {
    usertype(req, function(response) {
        if(response.userType === permissions[2].userType) {
            next();
        } else {
            res.redirect("/");
        }
    });
});
app.get('/api/user/global/requestDevice/*', requestLimit, function(req, res, next) {
    next();
});

// END API Interstate --

// API Preprocess Assigner

app.get('/api/:accesstype/:property/:subproperty/:jsonParams', function(req, res) {
    get.preprocessor(req.params.accesstype, req.params.property, req.params.subproperty, req.params.jsonParams, req, function(response) {
        res.send(response);
    });
});
app.get('/api/:accesstype/:property', function(req, res) {
    get.preprocessor(req.params.accesstype, req.params.property, 0, req, function(response) {
        res.send(response);
    });
});
app.post('/api/:accesstype/:property/:subproperty', function(req, res) {
    post.preprocessor(req.params.accesstype, req.params.property, req.params.subproperty, req, function(response) {
        res.send(response);
    });
});
app.post('/api/user/order/orderUpdateName', function(req, res) {
    post.orderUpdateName(req.body, function(response) {
        res.send(201);
    });
});
// END API Preprocess Assigner







server.listen(process.env.PORT || myPort, function (err) {
    if (err) {
        console.log(err)
    } else {
        if(process.env.PORT) console.log('NAP1 running on port: ' + process.env.PORT)
        if(!process.env.PORT) console.log('NAP1 running/listening on port:', myPort)
    }
});



