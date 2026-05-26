var Meihua = window.Meihua || {};

var MONTH_START_TERMS = [
  { name: '立春', month: 2,  C: 4.63, monthBranch: 2  },
  { name: '惊蛰', month: 3,  C: 5.63, monthBranch: 3  },
  { name: '清明', month: 4,  C: 4.81, monthBranch: 4  },
  { name: '立夏', month: 5,  C: 5.52, monthBranch: 5  },
  { name: '芒种', month: 6,  C: 5.63, monthBranch: 6  },
  { name: '小暑', month: 7,  C: 7.48, monthBranch: 7  },
  { name: '立秋', month: 8,  C: 7.90, monthBranch: 8  },
  { name: '白露', month: 9,  C: 7.73, monthBranch: 9  },
  { name: '寒露', month: 10, C: 8.32, monthBranch: 10 },
  { name: '立冬', month: 11, C: 7.44, monthBranch: 11 },
  { name: '大雪', month: 12, C: 7.18, monthBranch: 0  },
  { name: '小寒', month: 1,  C: 5.59, monthBranch: 1  }
];

function computeTermDay(year, C) {
  var y = year % 100;
  var day = Math.floor(y * 0.2422 + C);
  if (year >= 2000 && year <= 2099) {
    day -= Math.floor(y / 4);
  } else if (year >= 1900 && year <= 1999) {
    day -= Math.floor((y - 1) / 4);
  }
  return day;
}

function getTermDate(year, term) {
  var day = computeTermDay(year, term.C);
  return new Date(year, term.month - 1, day);
}

Meihua.getLiChun = function(year) {
  return getTermDate(year, MONTH_START_TERMS[0]);
};

Meihua.getMonthBranchAndYear = function(date) {
  var year = date.getFullYear();
  var liChunThisYear = getTermDate(year, MONTH_START_TERMS[0]);
  var baziYear = date < liChunThisYear ? year - 1 : year;

  var termDates = [];
  for (var i = 0; i < MONTH_START_TERMS.length; i++) {
    var term = MONTH_START_TERMS[i];
    var termYear = baziYear;
    if (term.month === 1) {
      termYear = baziYear + 1;
    }
    termDates.push({
      monthBranch: term.monthBranch,
      date: getTermDate(termYear, term)
    });
  }

  termDates.sort(function(a, b) {
    return a.date.getTime() - b.date.getTime();
  });

  var monthBranchIndex = termDates[termDates.length - 1].monthBranch;
  for (var j = 0; j < termDates.length; j++) {
    if (date < termDates[j].date) {
      monthBranchIndex = termDates[(j - 1 + termDates.length) % termDates.length].monthBranch;
      break;
    }
    if (j === termDates.length - 1) {
      monthBranchIndex = termDates[j].monthBranch;
    }
  }

  return { monthBranchIndex: monthBranchIndex, baziYear: baziYear };
};

window.Meihua = Meihua;
