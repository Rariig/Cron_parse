const getCron = require('./getCron');

test('Creates a cron expression from: * * * * MON,WED_4 22 5 33_21 resulting in: 22 4 * * MON,WED', () => {
    expect(getCron('* * * * MON,WED_4 22 5 33_21')).toBe('22 4 * * MON,WED');
  });