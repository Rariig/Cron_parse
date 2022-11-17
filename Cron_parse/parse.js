var parser = require('cron-parser');
var mergeRanges = require('merge-ranges');

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

var cronExprArray = ['0 0 * * MON', '0 0 * * MON-FRI', '0 0 * * MON-WED'];
var taskLengthsArray = [45, 60, 120];
var cronsWithLengthsArray = [];
var allTaskDatesArray = [];
var finalArray= [];

function populateCronsWithLengths(){
    for (let i = 0; i <cronExprArray.length ; i++) {
        var obj = {};
        obj.cronExpression = cronExprArray[i];
        obj.taskLengthInMinutes = taskLengthsArray[i];
        cronsWithLengthsArray.push(obj);
    }
}

function findEndDates(cronsWithLengthsArray, numberOfDays){
    var options = {
        currentDate: new Date(),
        endDate: addDays(Date(), numberOfDays),
        iterator: true
    };
    
    for (let i = 0; i < cronsWithLengthsArray.length; i++) { 
        iterator = true;
        var interval = parser.parseExpression(cronsWithLengthsArray[i].cronExpression, options);
        while (true) {
            try {
                var obj = {};
                obj.startDate = Convert_cron_value_to_date(interval.next().value);
                obj.endDate = addMinutes(obj.startDate, cronsWithLengthsArray[i].taskLengthInMinutes);
                allTaskDatesArray.push([obj.startDate, obj.endDate]);
            }
            catch (e) {
                break;
            }
        }
    }
}



try {
    populateCronsWithLengths();
    findEndDates(cronsWithLengthsArray, 21);
    finalArray = mergeRanges(allTaskDatesArray);
    for (let i = 0; i < finalArray.length; i++) {
        console.log('Start date: ' + finalArray[i][0] + ' End date: ' + finalArray[i][1]);
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

/*function Find_smallest_cron(inputCronArray, numberOfDays) {
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

try {
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
    
