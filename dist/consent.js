(() => {
  const storageKey = 'skyway-consent-v1';
  const maxAge = 365 * 24 * 60 * 60 * 1000;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved || !saved.savedAt || Date.now() - saved.savedAt > maxAge) return null;
      return saved;
    } catch {
      return null;
    }
  }

  function closeConsent() {
    document.querySelector('.consent-banner')?.classList.remove('visible');
    document.querySelector('.consent-backdrop')?.classList.remove('visible');
    document.body.classList.remove('consent-open');
  }

  function saveChoice(optional) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ necessary: true, optional, savedAt: Date.now() }));
    } catch {}
    closeConsent();
    document.dispatchEvent(new CustomEvent('skyway:consent', { detail: { optional } }));
  }

  function openConsent() {
    document.querySelector('.consent-banner')?.classList.add('visible');
    document.querySelector('.consent-backdrop')?.classList.add('visible');
    document.body.classList.add('consent-open');
    document.querySelector('.consent-banner .consent-primary')?.focus();
  }

  const root = document.createElement('div');
  root.innerHTML = `<div class="consent-backdrop" aria-hidden="true"></div><section class="consent-banner" role="dialog" aria-modal="true" aria-labelledby="consent-title" aria-describedby="consent-description"><div class="consent-copy"><span class="consent-kicker">Your privacy</span><h2 id="consent-title">Privacy choices</h2><p id="consent-description">We use essential browser storage to remember your choice and keep the website working. Skyway does not currently use analytics or advertising cookies.</p><a href="/cookies/">Read the Cookie Policy</a></div><div class="consent-actions"><button class="consent-primary" type="button" data-consent="necessary">Continue with necessary only</button><button class="consent-secondary" type="button" data-consent="all">Allow optional cookies</button></div></section>`;
  document.body.append(...root.children);

  document.querySelectorAll('[data-consent="necessary"]').forEach(button => button.addEventListener('click', () => saveChoice(false)));
  document.querySelectorAll('[data-consent="all"]').forEach(button => button.addEventListener('click', () => saveChoice(true)));
  document.querySelectorAll('[data-cookie-settings]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    openConsent();
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && readChoice()) closeConsent();
  });
  if (!readChoice()) window.setTimeout(openConsent, 250);
})();
