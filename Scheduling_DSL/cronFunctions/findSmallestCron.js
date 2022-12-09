var addDays = require('./Cron_parse/dateFunctions/addDays.js');

module.exports = function findSmallestCron(inputCronArray, numberOfDays) {
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
    var smallestInterval = findSmallestCron(cronExprArray, 21);
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