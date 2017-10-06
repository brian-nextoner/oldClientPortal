function homeCtrl($scope, $rootScope, currentUser) {
    var handleSuccess = function(data, status) {
        $scope.user = data.user;
        $scope.fname = data.fName;
        $scope.lname = data.lName;
        $scope.username = data.username;
        $scope.position = data.position;
        $scope.mobile = data.mobile;
        $scope.addr1 = data.addr1;
    };

    currentUser.getSession().success(handleSuccess);
    
    
};
function homeOrdersCtrl($scope, $rootScope, $http, fac_session) {
    var d = new Date();
    
    $scope.yrNum = new Date().getFullYear();
    $scope.moNum = d.getMonth();
    
    var getOrders = function(userKey, userType, moNum, yrNum) {
        var access = null;
        
        if(userType === 30) { 
            access = 'admin' 
        } else if(userType === 20) { 
            access = 'rep' 
        } else { 
            access = 'user' 
        }
        
        //alert(userKey + '-' + moNum + '-' + yrNum)
        if(userType > 10) {
            $http.get('/api/' + access + '/order/getOrdersByMonth/[' + userKey + ',' + moNum + ',' + yrNum + ']').success(function(data) {
                $scope.orders = data;
            }); 
        }
    }
    var handleSuccess = function(data, status) {
        var userKey = data.userKey;
        var userType = data.userType;
        var yrNum = new Date().getFullYear();
        var d = new Date();
        var moNum = d.getMonth();
        
        console.log(data.userType)
        getOrders(userKey, userType, moNum, yrNum);
    };
    
    $scope.update = function(date) {
        getOrders($rootScope.currentUser.userKey, $rootScope.currentUser.userType, date.moNum, date.yrNum)
    }

    fac_session.getSession().success(handleSuccess);
};
function orderHistDtl($scope, $http, $rootScope, fac_session){

    $scope.orderHistory = function(){
            alert('Hello')
        }
    
    var initData = function(data,status){
        var GuserKey = data.user.userKey;
        var GuserType = data.user.userType;
        var GcoKey = data.user.coKey;
        
        var getOrderHist = function(GcoKey,GuserKey){};
        
       
        
    }
    
    fac_session.getSession().success(initData);
};
function userHomeCtrl($scope, $rootScope, $http, fac_session, $window, ngDialog, $state) {
    var initData = function(data, status) {
        var GuserKey = data.userKey;
        var GuserType = data.userType;
        var GcoKey = data.coKey;
        var Gstate = data.state;
        
        
        
        $http.get('/api/user/global/makesAndModels/null').success(function(data) {  
            $scope.makesAndModels = data;
        });
        
         var getAlerts = function(userType) {
            var access = null;
                
            if(userType === 30) { 
                access = 'admin' 
            } else if(userType === 20) { 
                access = 'rep' 
            } else { 
                access = 'user' 
            }
            
            if(GuserKey != null) {
                $http.get('/api/' + access + '/customer/getAlerts/null').success(function(data) {  
                    $scope.alerts = data;
                });
            } else {
                $scope.alerts = data;
            }
            
            $scope.alertSentance = function(alertType, deviceType, deviceName) {
                if(alertType === 2 && deviceType === 1) {
                    return 'Device request for ' + deviceName + ' was denied.';
                } else if(alertType === 1 && deviceType === 2) {
                    return 'Pricing request for ' + deviceName + ' was fullfilled.'
                } else if(alertType === 1 && deviceType === 1) {
                    return 'Device request for ' + deviceName + ' was fullfilled.' 
                }
            }
            
            $scope.alertIcon = function(deviceType){
                if(deviceType === 1) {
                    return 'pg pg-printer';
                } else if(deviceType === 2) {
                    return 'fa fa-adjust';
                }
            }
            
            $scope.alertColor = function(alertType) {
                if(alertType === 2) {
                    return 'text-danger';
                } else {
                    return '';
                }
            }
            $scope.removeAlert = function($index, alertKey){
                $http.get('/api/' + access + '/customer/removeAlert/' + alertKey).success(function(data) {  
                    $scope.alerts.splice($index, 1);
                });
            }
        }

        
        var getCompany = function(userKey, userType) {
            var access = null;

            if(userType === 30) { 
                access = 'admin' 
            } else if(userType === 20) { 
                access = 'rep' 
            } else { 
                access = 'user' 
            }

            //alert(userKey + '-' + moNum + '-' + yrNum)

            $http.get('/api/' + access + '/company/getMyCompany/[' + userKey + ']').success(function(data) {
                $scope.company = data[0];
                $scope.coKey = data[0].coKey;
                getAlerts(GuserType);
            }); 
            
           
        }

        var getPrinters = function(coKey, userType) {
            var access = null;

            if(userType === 30) { 
                access = 'admin' 
            } else if(userType === 20) { 
                access = 'rep' 
            } else { 
                access = 'user' 
            }

            $http.get('/api/' + access + '/company/getMyPrinters/[' + coKey + ']').success(function(data) {  
                $scope.printers = data;
                $scope.addDeviceModal = function() {
                    ngDialog.open({ 
                        template: 'addDeviceModal', 
                        className: 'ngdialog-theme-default',
                        controller: 'userHomeCtrl'
                    });
                    
                }
                
                
                
                $scope.cantFindDevice = function() {
                    ngDialog.open({ 
                        template: 'cantFindDeviceModal', 
                        className: 'ngdialog-theme-default',
                        controller: 'userHomeCtrl'
                    });
                    
                    
                }
                
                $scope.removeDevice = function($index, coDeviceKey) {
                    var jsonParams = [
                        GcoKey, 
                        coDeviceKey
                    ]
                    $http.get('/api/' + access + '/company/removeDeviceFromCompany/[' + jsonParams + ']').success(function(data) {  
                        $state.reload();
                        //$scope.printers.splice($index, 1);
                        //$('.collapseMe').addClass('collapsed');
                        swal({
                            title: "Success!",
                            text: "Device successfully removed!",
                            type: "success"
                        });
                    });
                }
            }); 
        }
        
        

        var getToners = function(coKey, userType, deviceKey) {
            var access = null;

            if(userType === 30) { 
                access = 'admin' 
            } else if(userType === 20) { 
                access = 'rep' 
            } else { 
                access = 'user' 
            }

            $http.get('/api/' + access + '/toner/tonersForPrinter/[' + coKey + ',' + deviceKey + ']').success(function(data) {
                $scope.toners = data;
                $scope.requestPricing = function($event, tonerKey) {
                    var jsonParams = [
                        GuserKey,
                        tonerKey
                    ]
                    $http.get('/api/user/global/requestPricing/[' + jsonParams + ']').success(function(data) {
                        $event.currentTarget.innerHTML = 'Requested'
                        //swal('Success', 'We have received your request for toner pricing!', 'success');
                    }).error(function(data) {
                        swal('Error', 'There was an error with your request: ' + data, 'Error');  
                    });
                }
                
                $scope.addToCart = function(tonerKey, qty, partNo, type, yield, color) {
                    
                    var string = [
                        GcoKey,
                        GuserKey,
                        tonerKey,
                        qty
                    ]
                    $http.get('/api/' + access + '/cart/addItem/[' + string + ']').success(function(data) {
                        swal("Added To Cart", "You added " + qty + ' ' + partNo + ' to your cart!', "success")
                    });
                }
                
            }); 
        }
        
        var getCart = function(coKey, userType, state) {
            
            
            var access = null;
                
            if(userType === 30) { 
                access = 'admin' 
            } else if(userType === 20) { 
                access = 'rep' 
            } else { 
                access = 'user' 
            }
            
        
            
            

            $http.get('/api/' + access + '/cart/getActiveCart/[' + coKey + ']').success(function(data) {
                $scope.cartItems = data;
                $scope.getSubTotal = function(){
                    var total = 0;
                    for(var i = 0; i < $scope.cartItems.length; i++){
                        var product = $scope.cartItems[i];
                        total += (product.quoteprice * product.qty);
                    }
                    $scope.subTotal = total;
                    return total;
                }
                
                $http.get('/api/' + access + '/global/getStateInfo/' + Gstate).success(function(data) {
                    $scope.taxRate = data[0].taxRate;
                    if(!$scope.taxPercent) {
                        $scope.taxPercent = 0;
                    }else{
                        $scope.taxPercent = data[0].taxRate * 100;
                    }
                });
                
                $scope.getTax = function(rate, total, payTax) {
                    if(payTax === 1) {
                        return total * rate;
                    } else {
                        return 0;
                    }
                }
                $scope.getShipping = function(total, payShipping) {
                    if(total != 0 && payShipping === 1) {
                        return 10;
                    } else {
                        return 0;
                    }
                }
                $scope.getTotal = function(total, tax, shipping) {
                    $scope.totall = ( total + tax + shipping ) * 100;
                    $scope.total = ( total + tax + shipping );
                    return total + tax + shipping;
                }

                
                $scope.saveBtnRst = function(cartLineKey, qty) {
                    $scope.saveBtn = false;
                    $http.get('/api/' + access + '/cart/updateCart/[' + coKey + ',' + qty + ',' + cartLineKey + ']').success(function(data) {
                        $scope.printers = data;
                    });
                }
                $scope.deleteItem = function($index, cartLineKey) {
                    $scope.cartItems.splice($index, 1);
                    $http.get('/api/' + access + '/cart/cartRemoveItem/[' + coKey + ',' + cartLineKey + ']').success(function(data) {
                        $scope.printers = data;
                    });
                }
                $scope.pmtTerms = function(pmtTerms) {
                    if(pmtTerms === 1) {
                        return false;
                    } else {
                        return true;
                    }
                }
                
            }); 
        }
        
        var getOrderHistory = function(coKey, userKey, userType, orderCnt) {
            var access = null;
                
            if(userType === 30) { 
                access = 'admin' 
            } else if(userType === 20) { 
                access = 'rep' 
            } else { 
                access = 'user' 
            }
            
            $http.get('/api/' + access + '/order/orderHistory/['+coKey+','+userKey+','+orderCnt+']' ).success(function(data) {
                $scope.checkOutHdr = data;
                
                $scope.orderHistDtl = function(checkouthdrkey){
                    $http.get('/api/' + access + '/order/orderHistDtl/'+checkouthdrkey ).success(function(data) {
                        $scope.orderDtl=null;
                        $scope.orderDtl=data[0];
                        var pmtType = data[0].pmtType;
                        $scope.itemList = data;
                        
                        if( pmtType == 1){
                            $scope.pmtType = 'Credit Card'
                        }else if(pmtType == 2){
                           $scope.pmtType = 'Net 10' 
                        }
                        var createDate = new Date(data[0].createDate)
                        $scope.dueDate = createDate.setDate(createDate.getDate() + 10)
                        
                        var pmtStatus = data[0].pmtStatus
                        
                        if( pmtStatus == 1){
                            $scope.pmtStatus = 'Unpaid'
                        }else if(pmtStatus == 2){
                            $scope.pmtStatus = 'Pending'
                        }else if(pmtStatus >= 3){
                            $scope.pmtStatus = 'Paid in Full'
                        }

                        //If no shipping address is entered, then it uses the default address from tUser as sent by recordset
                        if( !data[0].addr1 ){
                            $scope.useAddr1 = data[0].defAddr1
                            $scope.useAddr2 = data[0].defAddr2
                            $scope.useCity = data[0].defCity
                            $scope.useState = data[0].defState
                            $scope.useZip = data[0].defZip
                            
                            $scope.addr2Show = true;
                            if( !data[0].defAddr2 )$scope.addr2Show = false;
                            
                        }else{
                            $scope.useAddr1 = data[0].addr1
                            $scope.useAddr2 = data[0].addr2
                            $scope.useCity = data[0].city
                            $scope.useState = data[0].state
                            $scope.useZip = data[0].zip
                            
                            $scope.addr2Show = true;
                            if( !data[0].addr2 ) $scope.addr2Show = false;                           
                        }
                        
                        $scope.ccDetails = function(chrgToken) {
                            $http.get('/chargecheck/' + chrgToken).success(function(data) {
                                ngDialog.open({ 
                                    template: 'templateId', 
                                    className: 'ngdialog-theme-default',
                                    controller: ['$scope', function($scope) {
                                        $http.get('/chargecheck/' + chrgToken).success(function(data) {
                                            
                                            $scope.type = data.source.brand;
                                            $scope.last4 = data.source.last4;
                                            $scope.created = data.created;
                                            $scope.amount = data.amount / 100;
                                            $scope.status = data.outcome.network_status;
                                            $scope.last4 = data.source.last4;
                                        });
                                    }]
                                });
                            });
                        }
                        
                        var transID = data[0].transactionId;
                        console.log(transID)
                        $scope.invoiceLink = 'https://www.nextoner.com/invoice.asp?action=1::'+transID;
                        
                        $scope.reorder = function(checkOutHdrKey) {
                            $http.get('/api/'+access+'/cart/reorder/' + checkOutHdrKey).success(function(data) {
                                swal('Success','This order was just added to your cart','success')
                            }).error(function(err){
                                swal('Error','Error: '+err,'error')
                            });
                        }
                        
                        $scope.editOrderTitle = function(checkOutHdrKey, orderName, orderDesc) {
                            
                            ngDialog.open({ 
                                template: 'editTitleModal', 
                                className: 'ngdialog-theme-default',
                                controller: ['$scope', function($scope) {
                                    $scope.thisKey = checkOutHdrKey;
                                    $scope.orderName = orderName;
                                    $scope.orderDesc = orderDesc;
                                    $scope.updateOrderName = function(checkOutHdrKey, update){
                                        var jsonParams = {
                                            checkOutHdrKey:checkOutHdrKey,
                                            orderName:update.orderName,
                                            orderDesc:update.orderDesc
                                        }
                                        $http.post('/api/'+access+'/order/orderUpdateName/', jsonParams).success(function(data) {
                                            swal('Success','Order name updated','success');
                                            $state.reload();
                                        }).error(function(err){
                                            swal('Error','Error: '+err,'error')
                                        });
                                    };
                                    
                                }]
                                
                            });
                            
                        }
                        
                    }); 
                }

            });
        }
        
        
        
        var companyHandleSuccess = function(userKey, userType) {
            getCompany(userKey, userType)
        };
        var printersHandleSuccess = function(coKey, userType) {
            getPrinters(coKey, userType) 
        };
        var cartHandleSuccess = function(coKey, userType, state) {
            getCart(coKey, userType, state) 
        };
        var tonersHandleSuccess = function(coKey, userType, deviceKey) {
            getToners(coKey, userType, deviceKey)
        };
        var orderHistoryHandleSuccess = function(coKey, userKey, userType, orderCnt) {
            getOrderHistory(coKey, userKey, userType, orderCnt)
        };

        $scope.printer = function(coKey) {
            printersHandleSuccess(GcoKey, GuserType);
        }
        $scope.cart = function(coKey) {
            cartHandleSuccess(GcoKey, GuserType, Gstate);
        }
        $scope.toner = function(deviceKey) {
            $scope.toners = null;
            tonersHandleSuccess(GcoKey, GuserType, deviceKey);
        }
        $scope.tonerCircle = function (color) {
          if (color === 'Black') {
            return { color: "black" }
          } else if (color === 'Cyan') {
            return { color: '#00FFFF' }
          } else if (color === 'Magenta') {
            return { color: '#FF00FF' }
          } else if (color === 'Yellow') {
            return { color: '#FFFF00' }
          } else {
              return { color: '#ffffff' }
          }
        }
        $scope.qtyChange = function(data) {
            $scope.saveBtn = true;
            
        }
        $scope.deleteItem = function($index) {
            //alert($index);
            $scope.cartItems.splice($index, 1);
        }
        $scope.orderHistory = function(orderCnt){
            orderHistoryHandleSuccess(GcoKey,GuserKey, GuserType, orderCnt)
        }
        $scope.liveSearch = function(searchParam) {
            if(GuserType === 30) { 
                access = 'admin' 
            } else if(GuserType === 20) { 
                access = 'rep' 
            } else { 
                access = 'user' 
            }
            if(searchParam === '') {searchParam='HP'}
            
            $http.get('/api/' + access + '/global/deviceSearch/' + searchParam).success(function(data) {
                $scope.searchRtn = data;
            });
        
        }
        $scope.addPrinter = function(deviceKey) {
            var jsonParams = [
                GcoKey,
                GuserKey,
                deviceKey
            ]
            
            $http.get('/api/' + access + '/company/addDevice/[' + jsonParams + ']').success(function(data) {
                $state.reload();
                swal({
                    title: "Success!",
                    text: "Device successfully added!",
                    type: "success"
                });
                
            }).error(function(err) {
                swal('Error', 'Error: ' + err, 'error');
            });
        }
        $scope.requestDevice = function(request) {
            var jsonParams = [
                GuserKey,
                '"' + request.make + '"',
                '"' + request.model + '"',
                '"' + request.spec + '"'                  
            ]
            $http.get('/api/user/global/requestDevice/[' + jsonParams + ']').success(function(data) {
                swal('Success', 'We will address your request as soon as possible!', 'success');
            });
            
        }
        $scope.payByInvoice = function() {
            ngDialog.open({ 
                template: 'payByInvoiceModal', 
                className: 'ngdialog-theme-default',
                controller: 'userHomeCtrl',
                scope: $scope
            });
        }
        $scope.invoiceOrder = function(inv) {
            $http.post('/invoice', inv).success(function(data) {
                swal('Success', 'We have succesfully processed your order. You can expect to receive and email with your invoice within 30 minutes', 'success'); 
                $state.reload();
            });
        }
        $scope.hidePricing = function(status, quotePrice) {
            if(status == 3 || status == null && quotePrice > 0) {
                $scope.reqMsg = null;
                return true;
            } else if(status == 3 || status == null && quotePrice == 0) {
                $scope.reqMsg = null;
                return false;
            } else if(status != 3 && status != null) {
                $scope.reqMsg = 'Toner pricing requested';
                return true;
            }
        }
        
        getPrinters(GcoKey, GuserType);
        companyHandleSuccess(GuserKey, GuserType);
    }
    
    fac_session.getSession().success(initData);
};
function FormWizardCtrl($scope,WizardHandler) {

    $scope.finished = function() {
        alert("Wizard finished :)");
    }

    $scope.logStep = function() {
        console.log("Step continued");
    }

    $scope.goBack = function() {
        WizardHandler.wizard().goTo(0);
    }

    $scope.getCurrentStep = function(){
        return WizardHandler.wizard().currentStepNumber();
    }
    $scope.goToStep = function(step){
        WizardHandler.wizard().goTo(step);
    }
    
    $scope.stripeCallback = function (code, result) {
        if (result.error) {
            window.alert('it failed! error: ' + result.error.message);
        } else {
            window.alert('success! token: ' + result.id);
        }
    };
    
    $(document).ready( function() {
      var form = $('#paymentPortal');

      form.find('select:first').change( function() {
        $.ajax( {
          type: "POST",
          url: form.attr( 'action', '/charge' ),
          data: form.serialize(),
          success: function( response ) {
            console.log( response );
          }
        });
      });

    });

};

homeCtrl.$inject = ['$scope', '$rootScope', 'currentUser'];
homeOrdersCtrl.$inject = ['$scope', '$http', '$rootScope', 'fac_session'];
orderHistDtl.$inject = ['$scope', '$http', '$rootScope', 'fac_session'];
userHomeCtrl.$inject = ['$scope', '$rootScope', '$http', 'fac_session', '$window', 'ngDialog', '$state'];
FormWizardCtrl.$inject = ['$scope', 'WizardHandler'];

app.controller('homeCtrl', homeCtrl);
app.controller('homeOrdersCtrl', homeOrdersCtrl);
app.controller('orderHistDtl', orderHistDtl);
app.controller('userHomeCtrl', userHomeCtrl);
app.controller('FormWizardCtrl', FormWizardCtrl);
