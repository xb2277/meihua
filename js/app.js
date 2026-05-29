var app = {
  selectedCategory: '恋爱',
  locale: 'zh',

  catDict: {
    '恋爱': 'Love', '招婿': 'Seek Son-in-law', '离婚': 'Divorce', '招亲': 'Seek Spouse',
    '嫁女': 'Marrying Daughter', '婚姻': 'Marriage', '怀孕': 'Pregnancy', '聚亲': 'Wedding',
    '求子': 'Seeking Child', '进学': 'School Admission', '读书': 'Studies', '应考': 'Exams',
    '求财': 'Wealth', '生意': 'Business', '交易': 'Trade', '办厂': 'Factory',
    '经商': 'Commerce', '开店': 'Open Shop', '推销': 'Sales', '借贷': 'Borrowing',
    '催款': 'Debt Collection', '承包': 'Contracting', '养猪': 'Pig Farming', '养鱼': 'Fish Farming',
    '养蜂': 'Beekeeping', '捕鱼': 'Fishing', '捕猎': 'Hunting', '开船': 'Boating',
    '中奖': 'Lottery', '求医': 'Medical Help', '疾病': 'Illness', '父病': 'Father\'s Health',
    '母病': 'Mother\'s Health', '妻病': 'Wife\'s Health', '子病': 'Child\'s Health',
    '命运': 'Destiny', '寿命': 'Longevity', '前程': 'Career Path', '后运': 'Later Fortune',
    '祖坟': 'Ancestral Grave', '屋基': 'House Foundation', '家运': 'Family Fortune',
    '造房': 'Building Home', '迁居': 'Relocation', '分居': 'Separation',
    '谋事': 'Planning', '工作': 'Job', '招工': 'Job Seeking', '待业': 'Unemployment',
    '调职': 'Job Transfer', '教书': 'Teaching', '行医': 'Medicine', '开车': 'Driving',
    '江湖': 'Wandering Life', '学艺': 'Learning Trade', '诉讼': 'Lawsuit', '是非': 'Disputes',
    '告状': 'Filing Complaint', '交友': 'Friendship', '寻人': 'Missing Person',
    '失物': 'Lost Items', '家信': 'Family Letters', '行人': 'Travelers', '出行': 'Travel'
  },

  texts: {
    zh: {
      pageTitle: '梅花卦典',
      introTitle: '梅花卦典',
      introBody: '梅花卦典是结合了三位先师的经验和若干古籍整理出来的卦典，需要求测者先平心静气几分钟，同时心中默默观照自己求测的问题，然后想一个数字，注意这里的"想"不是刻意的去想，而是抓住你脑中突然一闪而过的数字，如果你准备好了，请点击下方的按钮！',
      revealBtnText: '准备好了',
      btnHint: '— 心诚则灵 —',
      formTitle: '请选择求测信息',
      catLabel: '将你求测的事项尽量归类于下列项目之一',
      numLabel: '心中所念数字',
      numPlaceholder: '输入您脑海中一闪而过的数字',
      numHint: '静心默念所求之事，将心中闪现的数字填入',
      submitBtnText: '开始求测',
      resultLabel: '求测结果',
      toastInvalid: '请输入有效数字',
      langAttr: 'zh-CN'
    },
    en: {
      pageTitle: 'Meihua Oracle',
      introTitle: 'Meihua Oracle',
      introBody: 'The Meihua Oracle combines the wisdom of three ancient masters and classical texts. To consult the oracle, first calm your mind for a few minutes. Focus silently on your question, then let a number come to you — not by thinking hard, but by catching the one that flashes through your mind. When you are ready, press the button below.',
      revealBtnText: 'I\'m Ready',
      btnHint: '— Sincerity Reveals Truth —',
      formTitle: 'Consult the Oracle',
      catLabel: 'What area does your question relate to?',
      numLabel: 'The Number in Your Mind',
      numPlaceholder: 'Enter the number that flashed through your mind',
      numHint: 'Focus on your question, and enter the number that suddenly appeared in your thoughts',
      submitBtnText: 'Reveal Reading',
      resultLabel: 'Your Reading',
      toastInvalid: 'Please enter a valid number',
      langAttr: 'en'
    }
  },

  t: function(key) {
    return this.texts[this.locale][key] || key;
  },

  init: function() {
    this.detectRegion();
  },

  detectRegion: function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://ipapi.co/json/', true);
    xhr.timeout = 5000;
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          app.locale = data.country_code === 'CN' ? 'zh' : 'en';
        } catch (e) {}
      }
      app.setLocale(app.locale);
      app.afterLocale();
    };
    xhr.onerror = xhr.ontimeout = function() {
      app.setLocale(app.locale);
      app.afterLocale();
    };
    xhr.send();
  },

  setLocale: function(locale) {
    this.locale = locale;
    document.getElementById('localeTag').textContent = locale === 'zh' ? '海外版' : '中文版';
    document.getElementById('htmlRoot').lang = this.t('langAttr');
    document.getElementById('pageTitle').textContent = this.t('pageTitle');
    document.getElementById('introTitle').textContent = this.t('introTitle');
    document.getElementById('introBody').textContent = this.t('introBody');
    document.getElementById('revealBtnText').textContent = this.t('revealBtnText');
    document.getElementById('btnHint').textContent = this.t('btnHint');
    document.getElementById('formTitle').textContent = this.t('formTitle');
    document.getElementById('catLabel').textContent = this.t('catLabel');
    document.getElementById('numLabel').textContent = this.t('numLabel');
    document.getElementById('numInput').placeholder = this.t('numPlaceholder');
    document.getElementById('numHint').textContent = this.t('numHint');
    document.getElementById('submitBtnText').textContent = this.t('submitBtnText');

    document.getElementById('donateCN').style.display = locale === 'zh' ? '' : 'none';
    document.getElementById('donateOverseas').style.display = locale === 'en' ? '' : 'none';

    this.renderCategoryGrid();
  },

  afterLocale: function() {
    this.startClock();
    this.bindEvents();
  },

  startClock: function() {
    var isEn = this.locale === 'en';
    var tick = function() {
      var now = new Date();
      var lunar = Meihua.formatLunar(now);
      var sizhu = Meihua.computeSizhu(now);

      var h = now.getHours();
      var m = now.getMinutes();
      var s = now.getSeconds();
      var timeStr = (h < 10 ? '0' : '') + h + ':' +
                    (m < 10 ? '0' : '') + m + ':' +
                    (s < 10 ? '0' : '') + s;

      document.getElementById('currentTime').textContent = timeStr;

      if (isEn) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        document.getElementById('currentDate').textContent =
          months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
        document.getElementById('lunarDate').textContent =
          'Lunar ' + lunar.monthStr + ' ' + lunar.dayStr;
      } else {
        document.getElementById('currentDate').textContent =
          now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
        document.getElementById('lunarDate').textContent =
          '农历' + lunar.monthStr + '月' + lunar.dayStr;
      }

      document.getElementById('sizhu').textContent =
        sizhu.year + ' ' + sizhu.month + ' ' + sizhu.day + ' ' + sizhu.hour;
    };
    tick();
    setInterval(tick, 1000);
  },

  renderCategoryGrid: function() {
    var categories = Object.keys(Meihua.GUA_DICT);
    var grid = document.getElementById('categoryGrid');
    var html = '';
    var isEn = this.locale === 'en';
    for (var i = 0; i < categories.length; i++) {
      var cat = categories[i];
      var label = isEn ? (this.catDict[cat] || cat) : cat;
      var cls = cat === app.selectedCategory ? 'cat-item active' : 'cat-item';
      html += '<div class="' + cls + '" data-cat="' + cat + '">' + label + '</div>';
    }
    grid.innerHTML = html;
  },

  bindEvents: function() {
    var btn = document.getElementById('revealBtn');
    var form = document.getElementById('divinationForm');
    btn.addEventListener('click', function() {
      if (form.style.display === 'none' || !form.style.display) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
      }
    });

    document.getElementById('categoryGrid').addEventListener('click', function(e) {
      var target = e.target;
      if (target.classList.contains('cat-item')) {
        app.selectedCategory = target.dataset.cat;
        app.renderCategoryGrid();
      }
    });

    document.getElementById('submitBtn').addEventListener('click', app.onSubmit);

    document.getElementById('localeTag').addEventListener('click', function() {
      app.locale = app.locale === 'zh' ? 'en' : 'zh';
      app.setLocale(app.locale);
    });
  },

  onSubmit: function() {
    var numStr = document.getElementById('numInput').value.trim();
    var num = parseInt(numStr);
    if (isNaN(num) || num <= 0) {
      app.showToast(app.t('toastInvalid'));
      return;
    }

    var remainder = num % 8;
    var idx = remainder === 0 ? 7 : remainder - 1;
    var result = Meihua.GUA_DICT[app.selectedCategory][idx];

    document.getElementById('resultText').textContent = result;

    var summaryEl = document.getElementById('resultSummary');
    if (app.locale === 'en' && Meihua.GUA_SUMMARY && Meihua.GUA_SUMMARY[app.selectedCategory]) {
      var enSummary = Meihua.GUA_SUMMARY[app.selectedCategory][idx];
      summaryEl.textContent = enSummary || '';
      summaryEl.style.display = 'block';
    } else {
      summaryEl.style.display = 'none';
    }

    var catName = app.locale === 'en' ? (app.catDict[app.selectedCategory] || app.selectedCategory) : app.selectedCategory;
    document.getElementById('resultLabel').innerHTML =
      '【' + catName + '】<br><span class="result-subtitle">' + app.t('resultLabel') + '</span>';

    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
  },

  showToast: function(msg) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
    }, 2000);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  app.init();
});
