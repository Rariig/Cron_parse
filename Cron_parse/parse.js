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


// consists of 3 parts: 'cron_startDate endDate_daysToExecute'
var custom = 
//'* * * 11 *_4 22 5 33_21'; //every day during nov 4.22-5.33 
//'* * 12,26,28 * *_4 22 5 33_21'; //every 12,26,28 day during any month at 4.22-5.33 for 21 days from start
//'* * * * *_4 22 5 33_21'; // every day for 21 days at 4.22-5.33
//'* * * * MON,WED_4 22 5 33_21'; // every Monday and Wednesday for 21 days at 4.22-5.33
'*/30 * * * *_4 22 4 29_21'; // every 3 hours starting from 4.22 today for 21 days

var cronExprArray = [];
var tasksArray = [];
var cronsWithLengthsArray = [];
var allTaskDatesArray = [];
var arrayOfCronForOftenRecurringTask=[];
var finalArray= [];

function populateArraysWithOftenRecurring(customExpression){
    cronExprArray.push(getCron(customExpression));
    var minutesLeft = getRunningTimeInMinutes(customExpression);
    hoursToAdd= parseInt(getRecurrenceInMinutes(customExpression)/60)
    minutesToAdd = parseInt(getRecurrenceInMinutes(customExpression) % 60)
    temp = customExpression;
    while (minutesLeft >= 0) {
        tasksArray.push(getTaskLength(customExpression));
        tempHours = parseInt(temp.split('_')[1].split(' ')[0]) + hoursToAdd
        tempMinutes = parseInt(temp.split('_')[1].split(' ')[1]) + minutesToAdd
        if(tempMinutes >= 60){
            tempMinutes -=60
            tempHours +=1
        }
        if (tempHours >= 24) {
            tempHours -= 24;
        }
        if (tempHours == tempMinutes) {
            temp = temp.replace(temp.split('_')[1].split(' ')[1], tempMinutes)
            temp = temp.replace(temp.split('_')[1].split(' ')[0], tempHours)
            cronExprArray.push(getCron(temp));
            
            

            tempMinutes = parseInt(temp.split('_')[1].split(' ')[1]) + minutesToAdd
            let t = 0;
            var replace = "regex\\d";
            var re = new RegExp(replace,"g");
            const result = temp.replace(re, match => ++t === 2 ? tempMinutes : match);
            temp = result;
            cronExprArray.push(getCron(temp));
        }
        else if(tempHours != tempMinutes){
            temp = temp.replace(temp.split('_')[1].split(' ')[1], tempMinutes)
            temp = temp.replace(temp.split('_')[1].split(' ')[0], tempHours)
        }
        
        
        
       
        
       
        
        
        
    isInCronList = false;
    
     for (let i = 0; i < cronExprArray.length; i++) {
        if (getCron(temp) == cronExprArray[i]) {
            isInCronList = true;
        }
        
    }
    
    if (isInCronList == false) {
        cronExprArray.push(getCron(temp));
    }

        minutesLeft -= getRecurrenceInMinutes(customExpression);
    }

    
}

function getRunningTimeInMinutes(customExpression){
    return getDaysToRun(customExpression)*24*60;
}
function getRecurrenceInMinutes(customExpression){
    var recurrenceInMinutes =0;
    if (customExpression.split(' ')[0].indexOf('/')> -1) {
      recurrenceInMinutes=parseInt(recurrenceInMinutes +  customExpression.split(' ')[0].split('/')[1]);
    }
    if (customExpression.split(' ')[1].indexOf('/')> -1) {
        recurrenceInMinutes= parseInt(recurrenceInMinutes +  60*customExpression.split(' ')[1].split('/')[1]);
    }
    return recurrenceInMinutes;
}

//based on custom expression. start and end time will change.(tasklength stays) days to run stays.
function generateRecurringCrons(customExpression){ 
   var hoursToAdd= parseInt(getRecurrenceInMinutes(customExpression)/60)
   minutesToAdd = getRecurrenceInMinutes(customExpression) % 60
    return minutesToAdd;
}

function getTaskLength (customExpression){
    var customTaskLength = customExpression.split('_')[1];    
    customTaskLength = parseInt(customTaskLength.split(' ')[2]*60 - customTaskLength.split(' ')[0]*60)
    + parseInt(customTaskLength.split(' ')[3]-customTaskLength.split(' ')[1]);
    //tasksArray.push(customTaskLength); 
    return customTaskLength;
}

function getDaysToRun(customExpression){
    var customDaysToRun = parseInt(customExpression.split('_')[2]);
    return customDaysToRun;  
}

function replaceCronMinutesAndHours(customExpression){
    var cron = customExpression.split('_')[0];
    var customTaskLength = customExpression.split('_')[1];
    cron = cron.replace(cron.split(' ')[0], customTaskLength.split(' ')[1])
    cron = cron.replace(cron.split(' ')[1], customTaskLength.split(' ')[0])
    return cron;
}

function getCron(customExpression){
    var cron = customExpression.split('_')[0];
    var customTaskLength = customExpression.split('_')[1];
    cron = cron.replace(cron.split(' ')[1], customTaskLength.split(' ')[0])
    cron = cron.replace(cron.split(' ')[0], customTaskLength.split(' ')[1])
    //cronExprArray.push(cron)
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
        currentDate: new Date('December 2, 2022 22:16:00'),
        endDate: addDays(Date('December 2, 2022 22:16:00'), numberOfDays),
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

/*try {
    getCron(custom);
    getTaskLength(custom);
    mergeCronTasks(cronExprArray, tasksArray , getDaysToRun(custom));
    for (let i = 0; i < finalArray.length; i++) {
        console.log('Start date: ' + finalArray[i][0] + ' End date: ' + finalArray[i][1]);
    }
}
catch (err) {
    console.log('Error: ' + err.message);
}*/


try {
    console.log(getRecurrenceInMinutes(custom));
    console.log(generateRecurringCrons(custom));
    console.log(getRunningTimeInMinutes(custom));

    populateArraysWithOftenRecurring(custom);
    mergeCronTasks(cronExprArray, tasksArray , getDaysToRun(custom));
    for (let i = 0; i < finalArray.length; i++) {
        console.log('Start date: ' + finalArray[i][0] + ' End date: ' + finalArray[i][1]);
    }

}
catch (err) {
    console.log('Error: ' + err.message);
}

    
