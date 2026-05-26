var Meihua = window.Meihua || {};

var LUNAR_INFO = Meihua.LUNAR_INFO;
var LUNAR_MONTHS = Meihua.LUNAR_MONTHS;
var LUNAR_DAYS = Meihua.LUNAR_DAYS;

var EPOCH = new Date(1900, 0, 31);
var CALIBRATION_OFFSET = 2;

function getLunarYearDays(year) {
  var sum = 348;
  for (var i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
  }
  return sum + getLeapDays(year);
}

function getLeapMonth(year) {
  return LUNAR_INFO[year - 1900] & 0xf;
}

function getLeapDays(year) {
  if (getLeapMonth(year)) {
    return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function getLunarMonthDays(year, month) {
  return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

Meihua.solarToLunar = function(date) {
  var offset = Math.floor((date.getTime() - EPOCH.getTime()) / 86400000) - CALIBRATION_OFFSET;

  if (offset < 0) {
    return { year: 1900, month: 1, day: 1, isLeap: false };
  }

  var year = 1900;
  var daysInYear;
  while (year < 2100) {
    daysInYear = getLunarYearDays(year);
    if (offset < daysInYear) break;
    offset -= daysInYear;
    year++;
  }

  if (year > 2100) year = 2100;

  var leapMonth = getLeapMonth(year);
  var isLeap = false;
  var month = 1;
  var daysInMonth;

  while (month <= 12) {
    daysInMonth = getLunarMonthDays(year, month);
    if (offset < daysInMonth) break;
    offset -= daysInMonth;

    if (leapMonth > 0 && month === leapMonth) {
      daysInMonth = getLeapDays(year);
      if (offset < daysInMonth) {
        isLeap = true;
        break;
      }
      offset -= daysInMonth;
    }

    month++;
  }

  var dayIndex = offset + 1;

  return {
    year: year,
    month: month > 12 ? 12 : month,
    day: dayIndex,
    isLeap: isLeap
  };
};

Meihua.formatLunar = function(date) {
  var lunar = Meihua.solarToLunar(date);
  var monthStr = (lunar.isLeap ? '闰' : '') + LUNAR_MONTHS[lunar.month - 1];
  var dayStr = LUNAR_DAYS[lunar.day - 1];
  return {
    monthStr: monthStr,
    dayStr: dayStr,
    year: lunar.year,
    month: lunar.month,
    day: lunar.day,
    isLeap: lunar.isLeap
  };
};

window.Meihua = Meihua;
