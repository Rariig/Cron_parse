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
var custom = '0 0 * * MON,WED_4 22 5 33_21'; // consists of 3 parts: 'cron_startDate endDate_daysToExecute'
var cronExprArray = [] //, '0 0 * * MON-FRI', '0 0 * * MON-WED'];
var tasksArray = [] //,60]//, 120];
var cronsWithLengthsArray = [];
var allTaskDatesArray = [];
var finalArray= [];

function getTaskLength (customExpression){
    var customTaskLength = customExpression.split('_')[1];    
    customTaskLength = parseInt(customTaskLength.split(' ')[2]*60 - customTaskLength.split(' ')[0]*60)
    + parseInt(customTaskLength.split(' ')[3]-customTaskLength.split(' ')[1]);
    tasksArray.push(customTaskLength); 
    return customTaskLength;
}

function getDaysToRun(customExpression){
    var customDaysToRun = parseInt(customExpression.split('_')[2]);
    return customDaysToRun;  
}

function getCron(customExpression){
    var cron = customExpression.split('_')[0];
    var customTaskLength = customExpression.split('_')[1];
    cron = cron.replace(cron.split(' ')[0], customTaskLength.split(' ')[1])
    cron = cron.replace(cron.split(' ')[1], customTaskLength.split(' ')[0])
    cronExprArray.push(cron)
    return cron;
}


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
        currentDate: new Date('November 24, 2022 03:24:00'),
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
    getCron(custom);
    getTaskLength(custom);
    mergeCronTasks(cronExprArray, tasksArray , getDaysToRun(custom));
    for (let i = 0; i < finalArray.length; i++) {
        console.log('Start date: ' + finalArray[i][0] + ' End date: ' + finalArray[i][1]);
    }
}
catch (err) {
    console.log('Error: ' + err.message);
}


/*try {
    console.log(getTaskLength(custom));
    console.log(getDaysToRun(custom));
    console.log(getCron(custom));

}
catch (err) {
    console.log('Error: ' + err.message);
}*/

    
