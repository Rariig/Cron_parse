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

//var startAndEndTimeArray: string [] = Array()
try {
    
  var interval = parser.parseExpression('*/60 */1 * * *', options);
  
  while (true) {
    try {
      var obj = interval.next();
      console.log('value:', obj.value.toString(), 'done:', obj.done);
     // startAndEndTimeArray.push(obj.value.toString());
    } catch (e) {
      break;
    }
  }
  //console.log(startAndEndTimeArray);

} catch (err) {
  console.log('Error: ' + err.message);
}