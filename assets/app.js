/* 8x CRE — shared behavior. No dependencies. */
(function () {
  var EMAIL = 'benny@8xexit.com';

  // Phase 2 lead capture: paste the deployed Google Apps Script /exec URL here.
  // Empty string = Phase 1 fallback (opens a pre-filled email). No live change until set.
  var LEAD_ENDPOINT = '';

  /* Mobile nav toggle (accessible) */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function pageName() { return (document.title || '').split('—')[0].trim() || location.pathname; }

  // Fire-and-forget POST to the capture endpoint. Returns true if an endpoint is configured.
  function sendLead(payload) {
    if (!LEAD_ENDPOINT) return false;
    try {
      fetch(LEAD_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (e) { return false; }
  }

  function mailto(subject, body) {
    window.location.href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  /* Valuation form */
  var form = document.getElementById('valForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = {
        name: val('vName'), email: val('vEmail'), phone: val('vPhone'),
        asset: val('vAsset'), location: val('vLocation'), notes: val('vNotes'),
        page: pageName(), leadType: 'valuation'
      };
      var done = document.getElementById('valDone');
      if (sendLead(p)) {
        form.reset();
        if (done) { done.textContent = 'Got it — your request is in. Benny gets back to you same-day.'; done.style.display = 'block'; }
      } else {
        var subject = 'Free valuation request — ' + (p.asset || 'property') + (p.location ? (' (' + p.location + ')') : '');
        var body = 'Name: ' + p.name + '\nEmail: ' + p.email + '\nPhone: ' + p.phone +
          '\nWhat I own: ' + p.asset + '\nLocation: ' + p.location +
          '\n\nDetails:\n' + (p.notes || '(none)') + '\n\nPlease prepare my free, written valuation. Thank you.';
        mailto(subject, body);
        if (done) { done.style.display = 'block'; }
      }
    });
  }

  /* Interest form (8x Exit — opening soon) */
  var iform = document.getElementById('intForm');
  if (iform) {
    iform.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = {
        name: val('iName'), email: val('iEmail'), phone: val('iPhone'),
        asset: '', location: '', notes: val('iNotes'),
        page: pageName(), leadType: 'exit-interest'
      };
      var done = document.getElementById('intDone');
      if (sendLead(p)) {
        iform.reset();
        if (done) { done.textContent = "You're on the list — we'll reach out when 8x Exit opens."; done.style.display = 'block'; }
      } else {
        var subject = '8x Exit — notify me when it opens';
        var body = 'Name: ' + p.name + '\nEmail: ' + p.email + '\nPhone: ' + p.phone +
          '\nBusiness/industry: ' + (p.notes || '(none)') +
          '\n\nPlease notify me when 8x Exit opens for business-brokerage engagements. Thank you.';
        mailto(subject, body);
        if (done) { done.style.display = 'block'; }
      }
    });
  }
})();
