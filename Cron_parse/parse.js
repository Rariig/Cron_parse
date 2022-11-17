var parser = require('cron-parser');

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    date = result;
    return result;
}

let cronWithTaskLength  = class{
    
    constructor(cronExpression, taskLengthInMinutes){
    cronExpression;
    taskLengthInMinutes;
    }
}
let taskDates  = class{
    constructor(startDate, endDate){
     startDate;
     endDate;
    }
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

var cronExprArray = ['0 0 * * MON']
var cronsWithLengthsArray = [];
var taskDatesArray = [];

function populateCronsWithLengths(){
    for (let i = 0; i <cronExprArray.length ; i++) {
        var obj = {};
        obj.cronExpression = cronExprArray[i];
        obj.taskLengthInMinutes = 45;
        cronsWithLengthsArray.push(obj);
    }
}

function findEndDates(startDate, numberOfDays){
    var options = {
        currentDate: new Date(),
        endDate: addDays(Date(), numberOfDays),
        iterator: true
    };
    
    for (let i = 0; i < cronsWithLengthsArray.length; i++) {
        var interval = parser.parseExpression(cronsWithLengthsArray[i].cronExpression, options);
        var obj = {};
        obj.startDate =Convert_cron_value_to_date(startDate.value);
        interval.next();
        obj.endDate = addMinutes(Convert_cron_value_to_date(startDate.value), cronsWithLengthsArray[i].taskLengthInMinutes);
        taskDatesArray.push(obj);
    }
}



try {
    var smallestInterval = Find_smallest_cron(cronExprArray, 21);
    populateCronsWithLengths();
    while (true) {
        try {
            var obj = smallestInterval.next();
            findEndDates(obj, 21);
        }
        catch (e) {
            break;
        }
    }
    for (let i = 0; i < taskDatesArray.length; i++) {
        console.log('Start date: ' + taskDatesArray[i].startDate + ' End date: ' + taskDatesArray[i].endDate);
    }
}
catch (err) {
    console.log('Error: ' + err.message);
}




function getMonthFromString(mon){
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
 }

function Convert_cron_value_to_date(cron_value){
    month = getMonthFromString(String(cron_value).substring(4,7));
    day = (String(cron_value).substring(8,10));
    year = (String(cron_value).substring(11,15));
    time = (String(cron_value).substring(16,24));
    finalDate = new Date(String(month + '/' + day + '/' + year + ' '+ time));
    return finalDate;
}

function Find_smallest_cron(inputCronArray, numberOfDays) {
    var options = {
        currentDate: new Date(),
        endDate: addDays(Date(), numberOfDays),
        iterator: true
    };
    var testArray = new Array();
    var smallestInterval;
    x = 0;

    for (var i = 0; i < inputCronArray.length; i++) {
        var interval = parser.parseExpression(inputCronArray[i], options);
        var obj = interval.next();
        obj = interval.next();
        testArray.push(obj.value);
        if (testArray.length > 1) {
            if (Convert_cron_value_to_date(testArray[x]).getTime() < Convert_cron_value_to_date(testArray[i]).getTime()) {
                var interval = parser.parseExpression(inputCronArray[x], options);
                smallestInterval = interval;
            }
            else if (Convert_cron_value_to_date(testArray[x]).getTime() > Convert_cron_value_to_date(testArray[i]).getTime()) {
                var interval = parser.parseExpression(inputCronArray[i], options);
                x = i;
                smallestInterval = interval;
            }
        }
        else if (testArray.length == 1) {
            var interval = parser.parseExpression(inputCronArray[i], options);
            smallestInterval = interval;
        }
    }
    return smallestInterval;
}

/*try {
    var smallestInterval = Find_smallest_cron(cronExprArray, 21);
    while (true) {
        try {
            var obj = smallestInterval.next();
            console.log(obj.value.toString(), ' ', obj.done);
        }
        catch (e) {
            break;
        }
    }
    // value: Wed Dec 26 2012 14:44:00 GMT+0200 (EET) done: false
    // value: Wed Dec 26 2012 15:00:00 GMT+0200 (EET) done: false
    // value: Wed Dec 26 2012 15:22:00 GMT+0200 (EET) done: false
    // value: Wed Dec 26 2012 15:44:00 GMT+0200 (EET) done: false
    // value: Wed Dec 26 2012 16:00:00 GMT+0200 (EET) done: false
    // value: Wed Dec 26 2012 16:22:00 GMT+0200 (EET) done: true
}
catch (err) {
    console.log('Error: ' + err.message);
}*/

    
