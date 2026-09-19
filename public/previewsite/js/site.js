/* Brand X Commerce — site behaviour.
   Two things: the sticky header's scrolled state, and the audit form. */

// Header gains its background + bottom rule past 8px, per the design spec.
(function () {
  var header = document.querySelector('.bx-hdr');
  if (!header) return;
  var onScroll = function () {
    header.classList.toggle('bx-hdr--scrolled', window.scrollY > 8);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Auto year in the footer fine print.
(function () {
  var bar = document.querySelector('.bx-ftr__fine');
  if (bar) bar.textContent = '© ' + new Date().getFullYear() + ' Brand X Commerce. All rights reserved.';
})();

/* Lead form — submits to Formspree as JSON and swaps the card for an inline
   confirmation. Same endpoint and payload as the current live site; the form
   also carries a native action/method so it still works without JS. */
(function () {
  var form = document.querySelector('.lead-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var fine = form.querySelector('.form-fine');
    var label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      var payload = Object.fromEntries(new FormData(form).entries());
      var res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });

      /* Formspree explains its refusals in the response body (form disabled,
         monthly limit reached, domain not allowed, needs confirmation…).
         Surface that instead of a generic failure, or we are debugging blind. */
      if (!res.ok) {
        var detail = '';
        try {
          var body = await res.json();
          detail = (body.errors || []).map(function (x) {
            return (x.field ? x.field + ': ' : '') + x.message;
          }).join('; ') || body.error || JSON.stringify(body);
        } catch (parseErr) {
          try { detail = await res.text(); } catch (textErr) { detail = ''; }
        }
        console.error('[lead-form] Formspree rejected the submission', {
          status: res.status, statusText: res.statusText, detail: detail, endpoint: form.action
        });
        var e = new Error(detail || ('HTTP ' + res.status));
        e.status = res.status;
        throw e;
      }

      var first = (payload.name || '').trim().split(/\s+/)[0];
      var card = form.closest('.bx-card') || form;
      card.innerHTML =
        '<div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start">' +
        '<span class="bx-badge bx-badge--positive">Request received</span>' +
        '<h3 style="font-family:var(--font-display);font-size:var(--bx-text-title-3);font-weight:700;' +
        'letter-spacing:var(--bx-tracking-title);color:var(--text-primary);margin:0">' +
        (first ? 'Thanks, ' + first + '. ' : 'Thanks. ') + 'Your teardown is queued.</h3>' +
        '<p style="font-size:var(--bx-text-sm);line-height:var(--bx-leading-body);color:var(--text-secondary);margin:0">' +
        'A senior Brand X principal will review your store and reply personally to the email you provided, ' +
        'within one business day. No deck, no junior account exec, no obligation.</p>' +
        '<a class="bx-btn bx-btn--secondary bx-btn--md" href="free-audit.html">Send another</a>' +
        '</div>';
      card.setAttribute('tabindex', '-1');
      card.focus();
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = label;
      console.error('[lead-form] submit failed', err);
      if (fine) {
        var why = err && err.message ? err.message : 'the request could not be sent';
        fine.innerHTML =
          'We couldn’t send that — please email ' +
          '<a href="mailto:hello@brandxcommerce.com">hello@brandxcommerce.com</a> instead.' +
          '<br><span style="opacity:.75">(' + String(why).replace(/[<>&]/g, '') + ')</span>';
        fine.style.color = 'var(--bx-negative-500)';
      }
    }
  });
})();
