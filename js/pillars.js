var Meihua = window.Meihua || {};

var GAN = Meihua.GAN;
var ZHI = Meihua.ZHI;
var DAY_REFERENCE = Meihua.DAY_REFERENCE;
var DAY_REFERENCE_INDEX = Meihua.DAY_REFERENCE_INDEX;
var HOUR_BRANCH_MAP = Meihua.HOUR_BRANCH_MAP;

function computeYearPillar(baziYear) {
  var stemIndex = ((baziYear - 4) % 10 + 10) % 10;
  var branchIndex = ((baziYear - 4) % 12 + 12) % 12;
  return { stem: GAN[stemIndex], branch: ZHI[branchIndex], stemIndex: stemIndex, branchIndex: branchIndex };
}

function computeMonthPillar(yearStemIndex, monthBranchIndex) {
  var stemIndex = (yearStemIndex * 2 + monthBranchIndex) % 10;
  return { stem: GAN[stemIndex], branch: ZHI[monthBranchIndex], stemIndex: stemIndex, branchIndex: monthBranchIndex };
}

function computeDayPillar(date) {
  var msPerDay = 86400000;
  var normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  var daysDiff = Math.round((normalized.getTime() - DAY_REFERENCE.getTime()) / msPerDay);
  var sexagenaryIndex = ((daysDiff % 60) + DAY_REFERENCE_INDEX + 60) % 60;
  var stemIndex = sexagenaryIndex % 10;
  var branchIndex = sexagenaryIndex % 12;
  return { stem: GAN[stemIndex], branch: ZHI[branchIndex], stemIndex: stemIndex, branchIndex: branchIndex };
}

function computeHourPillar(dayStemIndex, hourBranchIndex) {
  var stemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;
  return { stem: GAN[stemIndex], branch: ZHI[hourBranchIndex], stemIndex: stemIndex, branchIndex: hourBranchIndex };
}

function getHourBranchIndex(hour) {
  for (var i = 0; i < HOUR_BRANCH_MAP.length; i++) {
    var range = HOUR_BRANCH_MAP[i];
    if (hour >= range.start && hour < range.end) {
      return range.branchIndex;
    }
  }
  return 0;
}

Meihua.computeSizhu = function(date) {
  var hour = date.getHours();
  var hourBranchIndex = getHourBranchIndex(hour);

  var mbResult = Meihua.getMonthBranchAndYear(date);
  var baziYear = mbResult.baziYear;
  var monthBranchIndex = mbResult.monthBranchIndex;

  var yearPillar = computeYearPillar(baziYear);
  var monthPillar = computeMonthPillar(yearPillar.stemIndex, monthBranchIndex);
  var dayPillar = computeDayPillar(date);
  var hourPillar = computeHourPillar(dayPillar.stemIndex, hourBranchIndex);

  return {
    year: yearPillar.stem + yearPillar.branch + '年',
    month: monthPillar.stem + monthPillar.branch + '月',
    day: dayPillar.stem + dayPillar.branch + '日',
    hour: hourPillar.stem + hourPillar.branch + '时'
  };
};

window.Meihua = Meihua;
