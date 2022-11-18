module.exports = function convertCronToDate(cron_value){
    var month = cron_value._date.month;
    var day = cron_value._date.day;
    var year = cron_value._date.year;
    var time = cron_value._date.hour + ':' + cron_value._date.minute + ':' + cron_value._date.second;
    var finalDate = new Date(String(month + '/' + day + '/' + year + ' '+ time));
    return finalDate;
}