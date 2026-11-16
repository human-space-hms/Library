/* Human Space 分析與同意橫幅（所有頁面共用） */
(function () {
  'use strict';

  /* ===== 只改這四行 ===== */
  var GA_ID = 'G-MJ31QW2HV1';                 // 換成你的 GA4 評估 ID
  var PRIVACY_URL = '/Library/privacy.html';  // 隱私權政策網址；頁面還沒做好就先改成 ''
  var REQUIRE_CONSENT = true;                 // true：同意後才載入 GA；false：直接載入且不顯示橫幅
  var KEY = 'hs-consent';
  /* ====================== */

  if (GA_ID.indexOf('XXXX') > -1) return;     // 還沒換成真的 ID 就什麼都不做

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var loaded = false;
  function loadGA() {
    if (loaded) return;
    loaded = true;
    window['ga-disable-' + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  function stopGA() {
    window['ga-disable-' + GA_ID] = true;
    var host = location.hostname;
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_ga' || n.indexOf('_ga_') === 0) {
        document.cookie = n + '=; Max-Age=0; path=/';
        document.cookie = n + '=; Max-Age=0; path=/; domain=' + host;
      }
    });
  }

  function apply(v) { if (v === 'granted') loadGA(); else stopGA(); }

  function showBanner() {
    var el = document.getElementById('hs-consent');
    if (el) { el.style.display = 'block'; return; }

    var st = document.createElement('style');
    st.textContent = [
      '#hs-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:620px;margin:0 auto;',
      'padding:16px 18px calc(16px + env(safe-area-inset-bottom));background:#FFFDF8;color:#3A342A;',
      'border:1px solid rgba(58,52,42,.18);border-radius:14px;box-shadow:0 8px 28px rgba(58,52,42,.18);',
      'font:13px/1.7 "Noto Sans TC","Work Sans",sans-serif}',
      '#hs-consent p{margin:0 0 12px}',
      '#hs-consent .hs-en{display:block;margin-top:4px;color:rgba(58,52,42,.72);font-size:12px}',
      '#hs-consent a{color:inherit;text-decoration:underline}',
      '#hs-consent .hs-btns{display:flex;gap:10px}',
      '#hs-consent button{flex:1;padding:10px 14px;border:1px solid #3A342A;border-radius:999px;',
      'background:transparent;color:#3A342A;font:inherit;font-weight:500;cursor:pointer}',
      '#hs-consent button:hover{background:#3A342A;color:#FBF6EA}'
    ].join('');
    document.head.appendChild(st);

    var link = PRIVACY_URL
      ? ' <a href="' + PRIVACY_URL + '">隱私權政策 Privacy Policy</a>'
      : '';

    el = document.createElement('div');
    el.id = 'hs-consent';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie');
    el.innerHTML =
      '<p>我們使用 Google Analytics 與 cookie 做匿名流量統計，了解哪些內容有幫助。你可以接受或拒絕，拒絕不影響你閱讀與使用本站。' +
      '<span class="hs-en">We use Google Analytics and cookies for anonymous traffic statistics. ' +
      'You can accept or decline, and declining does not affect how you use the site.</span>' + link + '</p>' +
      '<div class="hs-btns">' +
      '<button type="button" data-v="denied">拒絕 Decline</button>' +
      '<button type="button" data-v="granted">接受 Accept</button></div>';
    document.body.appendChild(el);

    el.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-v]') : null;
      if (!b) return;
      var v = b.getAttribute('data-v');
      set(v);
      apply(v);
      el.style.display = 'none';
    });
  }

  function init() {
    if (!REQUIRE_CONSENT) { loadGA(); return; }
    var v = get();
    if (v === 'granted' || v === 'denied') apply(v); else showBanner();
    var s = document.getElementById('hs-cookie-settings');
    if (s) s.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
