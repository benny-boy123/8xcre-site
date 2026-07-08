/* 8x CRE — shared behavior. No dependencies. */
(function () {
  var EMAIL = 'benny@8xcre.com';

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

  /* Scroll reveal — hidden state only applies once JS marks the doc, and a
     failsafe guarantees content is never left hidden if the observer misfires. */
  document.documentElement.classList.add('js');
  var srEls = document.querySelectorAll('.sr');
  var reveal = function (el) { el.classList.add('in'); };
  if (srEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    srEls.forEach(function (el) { io.observe(el); });
    setTimeout(function () { srEls.forEach(reveal); }, 4000); // failsafe
  } else {
    srEls.forEach(reveal);
  }
})();
