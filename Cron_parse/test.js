var parser = require('cron-parser');
function addTestDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    date = result;
    return result;
}
var options = {
    currentDate: new Date(),
    endDate: addTestDays(Date(), 1),
    iterator: true
};
var startAndEndTimeArray = Array();
try {
    var interval = parser.parseExpression('*/60 */1 * * *', options);
    while (true) {
        try {
            var obj = interval.next();
            startAndEndTimeArray.push(obj.value.toString());
        }
        catch (e) {
            break;
        }
    }
    console.log(startAndEndTimeArray);
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
