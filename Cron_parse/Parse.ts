var parser = require('cron-parser');

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  date = result;
  return result;
}

var interval = parser.parseExpression('0 0 * * MON', options);
var interval2 = parser.parseExpression('0 0 * * MON-FRI', options);

function Cron_parse(cronExpressionsArray:Date[], numberOfDays:number){
cronExpressionsArray.push(interval,interval2);

    var startAndEndTimeArray:string [];
    var options = {
  currentDate: new Date(),
  endDate: addDays(Date(), numberOfDays),
  iterator: true
};

function Compare_dates(date1:Date, date2:Date){
var testArray:string [] = new Array();
var testArray2:string [] = new Array();;
for(let i = 0; i < 2; i++){
  var obj = interval.next();
  testArray.push(obj.value.toString());
  var obj2 = interval2.next();
  testArray2.push(obj2.value.toString());
}

if(testArray[1]<testArray2[1]){
    return interval;
  }
else if(testArray[1]>testArray2[1]){
  return interval2;
}
}


try {
  for(let i = 0; i < cronExpressionsArray.length; i++){
    for(let j = 0; j < cronExpressionsArray.length; j++){
        var smallestInterval = Compare_dates(cronExpressionsArray[i], cronExpressionsArray[j])
    }
  }

  while (true) {
    try {
      var obj = smallestInterval.next();
      console.log(obj.value.toString(), ' ', obj.done);
    } catch (e) {
      break;
    }
  }

  // value: Wed Dec 26 2012 14:44:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 15:00:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 15:22:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 15:44:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 16:00:00 GMT+0200 (EET) done: false
  // value: Wed Dec 26 2012 16:22:00 GMT+0200 (EET) done: true
} catch (err) {
  console.log('Error: ' + err.message);
}
  }
  

  