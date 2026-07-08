/* 8x CRE — shared behavior. No dependencies. */
(function () {
  var EMAIL = 'benny@8xexit.com';

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
      toggle.textContent = open ? '✕' : '☰';
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Menu');
        toggle.textContent = '☰';
      }
    });
  }

  /* Valuation form -> concierge email (Phase 1: no backend, mirrors parks funnel) */
  var form = document.getElementById('valForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = get('vName');
      var email = get('vEmail');
      var phone = get('vPhone');
      var asset = get('vAsset');
      var loc = get('vLocation');
      var notes = get('vNotes');

      var subject = 'Free valuation request — ' + (asset || 'property') + (loc ? ' (' + loc + ')' : '');
      var body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'What I own: ' + asset + '\n' +
        'Location: ' + loc + '\n\n' +
        'Details:\n' + (notes || '(none)') + '\n\n' +
        'Please prepare my free, written valuation. Thank you.';

      window.location.href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      var done = document.getElementById('valDone');
      if (done) { done.style.display = 'block'; }
    });
  }

  /* 8x Exit interest form -> plain "notify me" email (NOT a valuation request) */
  var iform = document.getElementById('intForm');
  if (iform) {
    iform.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var subject = 'Register interest — 8x Exit (business brokerage arm)';
      var body =
        'Name: ' + get('iName') + '\n' +
        'Email: ' + get('iEmail') + '\n' +
        'Phone: ' + get('iPhone') + '\n' +
        'Business / industry (optional): ' + (get('iNotes') || '(none)') + '\n\n' +
        'Please add me to the 8x Exit early-notice list. I understand 8x Exit is not yet open ' +
        'for business-brokerage engagements and this is informational only.';
      window.location.href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      var done = document.getElementById('intDone');
      if (done) { done.style.display = 'block'; }
    });
  }
})();
