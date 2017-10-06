
var createDate = '2017-03-07 14:39:52.953';

var someDate = new Date(createDate);
var numberOfDaysToAdd = 10;
someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 

var num = 1000000

var amountDue = '$' + num.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

console.log(amountDue);