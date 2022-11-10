var parser = require('cron-parser');

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    date = result;
    return result;
}


var cronExprArray = ['0 */12 * * *','0 0 * * MON-FRI', '0 */6 * * *']
var startAndEndTimeArray = [];

function Cron_parse(cronExpressionsArray, numberOfDays) {
    
    var options = {
        currentDate: new Date(),
        endDate: addDays(Date(), numberOfDays),
        iterator: true
    };
    for (let i = 0; i < cronExpressionsArray.length; i++) {
        startAndEndTimeArray.push(parser.parseExpression(cronExprArray[i], options));
    }
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

function Find_smallest_cron() {
    var options2 = {
        currentDate: new Date(),
        endDate: addDays(Date(), 21),
        iterator: true
    };
    var testArray = new Array();
    var smallestInterval;
    x = 0;

    for (var i = 0; i < cronExprArray.length; i++) {
        var interval = parser.parseExpression(cronExprArray[i], options2);
        var obj = interval.next();
        obj = interval.next();
        testArray.push(obj.value);
        if (testArray.length > 1) {
            if (Convert_cron_value_to_date(testArray[x]).getTime() < Convert_cron_value_to_date(testArray[i]).getTime()) {
                var interval = parser.parseExpression(cronExprArray[x], options2);
                smallestInterval = interval;
            }
            else if (Convert_cron_value_to_date(testArray[x]).getTime() > Convert_cron_value_to_date(testArray[i]).getTime()) {
                var interval = parser.parseExpression(cronExprArray[i], options2);
                x = i;
                smallestInterval = interval;
            }
        }
    }
    return smallestInterval;
}

try {
    Cron_parse(cronExprArray, 21);
    var smallestInterval = Find_smallest_cron();
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
}

    
