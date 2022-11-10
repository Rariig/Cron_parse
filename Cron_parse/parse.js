var parser = require('cron-parser');

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    date = result;
    return result;
}


var cronExprArray = ['0 0 * * MON','0 0 * * MON-FRI']
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

    function Compare_dates(inputInterval1, inputInterval2) {
        var testArray = new Array();
        var testArray2 = new Array();
        ;
        for (var i = 0; i < 2; i++) {
            var obj = inputInterval1.next();
            testArray.push(obj.value);
        }
        for (var i = 0; i < 2; i++) {
            var obj2 = inputInterval2.next();
            testArray2.push(obj2.value);
        }
        
        if (testArray[1] < testArray2[1]) {
            return inputInterval1;
        }
        else if (testArray[1] > testArray2[1]) {
            return inputInterval2;
        }
    }

    try {
        Cron_parse(cronExprArray, 21);
        /*for (var i = 0; i < startAndEndTimeArray.length; i++) {
            for (var j = 0; j < startAndEndTimeArray.length; j++) {
               if(i!=j) {
                
               }
            }
        }*/
        var smallestInterval = Compare_dates(startAndEndTimeArray[0], startAndEndTimeArray[1]);
        
        
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

    
