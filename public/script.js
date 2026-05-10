// Sticky header shadow on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const mobileNav = document.getElementById('mobileNav');
toggle?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Auto year
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Lead form: progressive enhancement — submit via fetch and show inline confirmation
const form = document.querySelector('.lead-form');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const fine = form.querySelector('.form-fine');
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const data = new URLSearchParams(new FormData(form));
    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString()
    });
    if (!res.ok) throw new Error('bad response');
    form.innerHTML = '<h3>Thanks — we\'ll be in touch within one business day.</h3><p>A senior Brand X principal will review your store and reply personally to the email you provided.</p>';
  } catch (err) {
    btn.disabled = false; btn.textContent = 'Send my free audit request';
    fine.textContent = 'Something went wrong sending the form. Please email hello@brandxcommerce.com.';
    fine.style.color = '#b13a3a';
  }
});
