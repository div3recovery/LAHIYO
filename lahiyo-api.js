/**
 * Lahiyo — connects this page to the Apps Script backend.
 * The page code calls google.script.run.someFunction(...) exactly as inside Apps Script;
 * this file sends those calls to the Web app URL in config.js instead.
 */
(function () {
  function apiUrl() {
    var u = String((window.LAHIYO_CONFIG && window.LAHIYO_CONFIG.API_URL) || '').trim();
    // Accepts .../macros/s/<id>/exec (also Workspace links .../a/macros/<domain>/s/<id>/exec)
    if (!/^https:\/\/script\.google\.com\/(macros\/s|a\/macros\/[^\/\s]+\/s)\/[^\/\s]+\/(exec|dev)\/?$/.test(u)) {
      var shown = !u || u === 'PASTE_YOUR_WEB_APP_URL_HERE' ? 'nothing yet' : '"' + u.slice(0, 70) + (u.length > 70 ? '…' : '') + '"';
      throw new Error('Setup is not complete: config.js must contain the Apps Script Web app URL ending in /exec. It currently has ' + shown + '.');
    }
    return u.replace(/\/$/, '');
  }

  function call(fn, args) {
    var url;
    try { url = apiUrl(); } catch (e) { return Promise.reject(e); }
    return fetch(url, {
      method: 'POST',
      // text/plain avoids the browser's extra "preflight" check, which Apps Script does not answer
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ fn: fn, args: args }),
      redirect: 'follow'
    }).then(function (r) {
      if (!r.ok) throw new Error('The server answered with an error (' + r.status + '). Please try again.');
      return r.text();
    }).then(function (t) {
      var j;
      try { j = JSON.parse(t); }
      catch (e) { throw new Error('The server did not answer correctly. Check that the Web app is deployed with access "Anyone".'); }
      if (!j.ok) throw new Error(j.error || 'Unknown error');
      return j.data;
    }, function (e) {
      if (e && /fetch|network/i.test(e.message)) throw new Error('Cannot reach the Lahiyo server. Check your internet connection and the URL in config.js.');
      throw e;
    });
  }

  function makeRunner(onOk, onFail) {
    var base = {
      withSuccessHandler: function (f) { return makeRunner(f, onFail); },
      withFailureHandler: function (f) { return makeRunner(onOk, f); }
    };
    return new Proxy(base, {
      get: function (target, name) {
        if (name in target) return target[name];
        return function () {
          var args = Array.prototype.slice.call(arguments);
          call(String(name), args).then(
            function (d) { if (onOk) onOk(d); },
            function (e) { if (onFail) onFail(e); }
          );
        };
      }
    });
  }

  window.google = { script: { run: makeRunner(null, null) } };
})();
