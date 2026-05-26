var app = {
  selectedCategory: '恋爱',

  init: function() {
    this.startClock();
    this.renderCategoryGrid();
    this.bindEvents();
  },

  startClock: function() {
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
      document.getElementById('currentDate').textContent =
        now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
      document.getElementById('lunarDate').textContent =
        '农历' + lunar.monthStr + '月' + lunar.dayStr;
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
    for (var i = 0; i < categories.length; i++) {
      var cls = categories[i] === app.selectedCategory ? 'cat-item active' : 'cat-item';
      html += '<div class="' + cls + '" data-cat="' + categories[i] + '">' + categories[i] + '</div>';
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
    document.getElementById('adSkipBtn').addEventListener('click', app.onAdComplete);
  },

  onSubmit: function() {
    var numStr = document.getElementById('numInput').value.trim();
    var num = parseInt(numStr);
    if (isNaN(num) || num <= 0) {
      app.showToast('请输入有效数字');
      return;
    }

    var remainder = num % 8;
    var idx = remainder === 0 ? 7 : remainder - 1;
    var result = Meihua.GUA_DICT[app.selectedCategory][idx];

    document.getElementById('resultText').textContent = result;
    document.getElementById('resultLabel').textContent = '【' + app.selectedCategory + '】求测结果';

    // 跳转到广告占位
    app.showAd(function() {
      document.getElementById('adSection').style.display = 'none';
      document.getElementById('resultSection').style.display = 'block';
      document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    });
  },

  showAd: function(callback) {
    document.getElementById('adSection').style.display = 'block';
    document.getElementById('adSection').scrollIntoView({ behavior: 'smooth' });
    app._adCallback = callback;
    // TODO: 后续接入真实广告SDK，广告播放完成后调用 app.onAdComplete()
  },

  onAdComplete: function() {
    if (app._adCallback) {
      app._adCallback();
      app._adCallback = null;
    }
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
