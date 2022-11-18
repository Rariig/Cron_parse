var parser = require('cron-parser');
var mergeRanges = require('merge-ranges');
var addDays = require('./dateFunctions/addDays.js');
var addMinutes = require('./dateFunctions/addMinutes.js');
var convertCronToDate = require('./cronFunctions/convertCronToDate.js');


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

var cronExprArray = ['0 0 * * MON', '0 0 * * MON-FRI', '0 0 * * MON-WED'];
var tasksArray = [45, 60, 120];
var cronsWithLengthsArray = [];
var allTaskDatesArray = [];
var finalArray= [];



function mergeCronTasks(cronArray, taskLengthsArray, numberOfDays){
    populateCronsWithLengths(cronArray, taskLengthsArray);
    findEndDates(cronsWithLengthsArray, numberOfDays);
    finalArray = mergeRanges(allTaskDatesArray);
    return finalArray;
}

function populateCronsWithLengths(cronArray, taskLengthsArray){
    for (let i = 0; i <cronArray.length ; i++) {
        var obj = {};
        obj.cronExpression = cronArray[i];
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
                obj.startDate = convertCronToDate(interval.next().value);
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
    mergeCronTasks(cronExprArray, tasksArray , 21);
    for (let i = 0; i < finalArray.length; i++) {
        console.log('Start date: ' + finalArray[i][0] + ' End date: ' + finalArray[i][1]);
    }
}
catch (err) {
    console.log('Error: ' + err.message);
}




    
