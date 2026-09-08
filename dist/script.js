const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
const backdrop = document.querySelector('.nav-backdrop');
const navigationLinks = [...document.querySelectorAll('#nav a, .mobile-dock a')];

function setMenu(open) {
  nav.classList.toggle('open', open);
  backdrop.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  backdrop.tabIndex = open ? 0 : -1;
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
backdrop.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

navigationLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));

const sectionToDock = {
  top: 'top',
  why: 'top',
  products: 'products',
  skyblue: 'products',
  agriculture: 'products',
  industries: 'industries',
  support: 'industries',
  technical: 'industries',
  company: 'industries',
  contact: 'contact'
};

const trackedSections = Object.keys(sectionToDock)
  .map(id => document.getElementById(id))
  .filter(Boolean);

function setActiveSection(id) {
  navigationLinks.forEach(link => {
    const isDockLink = Boolean(link.dataset.section);
    const active = isDockLink
      ? link.dataset.section === sectionToDock[id]
      : link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function updateActiveFromScroll() {
  const marker = window.scrollY + window.innerHeight * 0.28;
  let current = trackedSections[0];
  trackedSections.forEach(section => {
    if (section.offsetTop <= marker) current = section;
  });
  setActiveSection(current.id);
}

window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
window.addEventListener('resize', updateActiveFromScroll);
updateActiveFromScroll();

document.querySelector('#quoteForm').addEventListener('submit', async event => {
  event.preventDefault();
  const fields = [...event.target.querySelectorAll('input:not([type="checkbox"]),select,textarea')]
    .map(element => `${element.closest('label')?.childNodes[0]?.textContent?.trim() || 'Detail'}: ${element.value || 'Not supplied'}`);
  const products = [...event.target.querySelectorAll('input[type="checkbox"]:checked')].map(element => element.value);
  const text = ['SKYWAY LUBRICANTS ENQUIRY', ...fields, `Products: ${products.join(', ') || 'Not selected'}`].join('\n');
  try { await navigator.clipboard.writeText(text); } catch {}
  const note = document.querySelector('#formNote');
  note.innerHTML = 'Your enquiry is ready. <a href="sms:+27615146353?body=' + encodeURIComponent(text) + '">Continue in Messages</a> or call <a href="tel:+27615146353">+27 61 514 6353</a>.';
  event.target.querySelector('button').textContent = 'Enquiry prepared';
});

document.querySelectorAll('.footer-policies a[href^="#"],a[href="#privacy"],a[href="#terms"]').forEach(link => {
  link.addEventListener('click', () => {
    const panel = document.querySelector(link.getAttribute('href'));
    if (panel?.tagName === 'DETAILS') panel.open = true;
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
