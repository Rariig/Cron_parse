var parser = require('cron-parser');

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  date = result;
  return result;
}

function Cron_parse(cronExpressionsArray:string[], numberOfDays:number){

    var startAndEndTimeArray:string [];
    var parser = require('cron-parser');
    var options = {
  currentDate: new Date(),
  endDate: addDays(Date(), numberOfDays),
  iterator: true
};

try {
  var interval = parser.parseExpression('*/22 * * * *', options);

  while (true) {
    try {
      var obj = interval.next();
      console.log('value:', obj.value.toString(), 'done:', obj.done);
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
  

  