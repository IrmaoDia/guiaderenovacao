const offer = window.OFFER_CONFIG || {};
const checkoutButton = document.querySelector('[data-checkout]');

function validUrl(value, protocols = ['https:']) {
  try {
    const url = new URL(value);
    return protocols.includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: offer.currency || 'BRL'
  }).format(value);
}
const hasPrice = Number.isFinite(offer.price) && offer.price > 0;
const installments = offer.installments;
const hasInstallments = hasPrice && Number.isInteger(installments?.count) && installments.count > 1 &&
  Number.isFinite(installments.amount) && installments.amount > 0;
if (hasPrice) {
  const price = document.querySelector('[data-offer-price]');
  price.textContent = hasInstallments
    ? `${installments.count}x de ${formatPrice(installments.amount)}`
    : formatPrice(offer.price);
  price.classList.remove('price-pending');
  if (Number.isFinite(offer.comparisonPrice) && offer.comparisonPrice > offer.price) {
    const comparison = document.querySelector('[data-comparison-price]');
    const previous = document.createElement('span');
    previous.className = 'comparison-value';
    previous.textContent = formatPrice(offer.comparisonPrice);
    comparison.replaceChildren('O valor de referência do guia é de ', previous);
    comparison.hidden = false;
  }
}
const cashPrice = document.querySelector('[data-offer-cash-price]');
cashPrice.textContent = hasInstallments ? `ou ${formatPrice(offer.price)} à vista` : '';
cashPrice.hidden = !hasInstallments;
// null preserves the HTML fallback; an empty URL explicitly disables checkout.
const checkoutUrl = validUrl(offer.checkoutUrl ?? checkoutButton.getAttribute('href'));
if (checkoutUrl) checkoutButton.href = checkoutUrl;
else {
  checkoutButton.removeAttribute('href');
  checkoutButton.setAttribute('aria-disabled', 'true');
  document.querySelector('#checkout-message').hidden = false;
}
document.querySelector('[data-purchase-note]').hidden = !(offer.deliveryConfirmed && checkoutUrl);
if (Number.isInteger(offer.guaranteeDays) && offer.guaranteeDays > 0) {
  const period = document.querySelector('[data-guarantee-period]');
  const guaranteeTime = `${offer.guaranteeDays} ${offer.guaranteeDays === 1 ? 'dia' : 'dias'}`;
  period.textContent = guaranteeTime;
  period.hidden = false;
  document.querySelector('[data-guarantee-text]').textContent =
    `Você tem ${guaranteeTime} para experimentar. Se nesse período você acreditar que o Guia dos Rituais de Recomeço não é para você, basta solicitar o reembolso pelos canais oficiais da compra para receber 100% do valor investido.`;
  document.querySelector('[data-guarantee-faq]').textContent =
    `Você tem ${guaranteeTime} para conhecer o Guia dos Rituais de Recomeço. Se o material não for para você, solicite o reembolso de 100% do valor investido pelos canais oficiais da compra.`;
}
if (offer.deliveryConfirmed && typeof offer.deliveryText === 'string' && offer.deliveryText.trim()) {
  document.querySelectorAll('[data-delivery-text]').forEach(element => {
    element.textContent = offer.deliveryText;
  });
}
if (offer.bonusesIncluded === true) {
  document.querySelector('[data-bonus-heading]').textContent =
    'AO ADQUIRIR O GUIA DOS RITUAIS DE RECOMEÇO, VOCÊ TAMBÉM RECEBE 3 MATERIAIS COMPLEMENTARES';
  document.querySelector('[data-bonus-note]').textContent = 'Os três materiais abaixo estão incluídos no seu kit.';
  document.querySelector('[data-kit-bonus-label]').textContent = 'Seu kit também inclui:';
  document.querySelector('[data-kit-description]').textContent = 'Guia dos Rituais de Recomeço + 3 materiais complementares.';
}
const legalNavigation = document.querySelector('.legal-links');
[['privacy', 'Política de Privacidade'], ['terms', 'Termos de Uso'], ['contact', 'Contato']]
  .forEach(([key, label]) => {
    const url = validUrl(offer.legalLinks?.[key], ['https:', 'mailto:', 'tel:']);
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.textContent = label;
    legalNavigation.append(link);
    legalNavigation.hidden = false;
  });

const carousel = document.querySelector('.carousel');
const viewport = carousel.querySelector('.carousel-window');
const track = carousel.querySelector('.carousel-track');
const slides = [...track.children];
const dots = document.querySelector('.carousel-dots');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let scrollFrame = 0;
let wheelUntil = 0;

function updateSlide(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', String(i !== current));
    slide.inert = i !== current;
  });
  [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
  carousel.querySelector('.previous').disabled = current === 0;
  carousel.querySelector('.next').disabled = current === slides.length - 1;
}
function showSlide(index) {
  const next = Math.max(0, Math.min(index, slides.length - 1));
  viewport.scrollTo({ left: next * viewport.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
slides.forEach((slide, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Mostrar depoimento ${i + 1} de ${slides.length}`);
  dot.addEventListener('click', () => showSlide(i));
  dots.append(dot);
});
carousel.querySelector('.previous').addEventListener('click', () => showSlide(current - 1));
carousel.querySelector('.next').addEventListener('click', () => showSlide(current + 1));
carousel.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(current + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(current - 1); }
});
viewport.addEventListener('scroll', () => {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(() => {
    const index = Math.round(viewport.scrollLeft / viewport.clientWidth);
    if (index !== current) updateSlide(index);
  });
}, { passive: true });
// Preserve native horizontal gestures; the mouse wheel advances one testimonial.
viewport.addEventListener('wheel', event => {
  if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || Math.abs(event.deltaY) < 4) return;
  if (Date.now() < wheelUntil) { event.preventDefault(); return; }
  const next = current + (event.deltaY > 0 ? 1 : -1);
  if (next < 0 || next >= slides.length) return;
  event.preventDefault();
  wheelUntil = Date.now() + 650;
  showSlide(next);
}, { passive: false });
new ResizeObserver(() => {
  viewport.scrollTo({ left: current * viewport.clientWidth, behavior: 'instant' });
}).observe(viewport);
updateSlide(0);

const guideCarousel = document.querySelector('.guide-carousel');
const guideTrack = guideCarousel.querySelector('.guide-track');
const guidePages = [...guideTrack.children];
const guideDots = guideCarousel.querySelector('.guide-dots');
let guideIndex = 0;
let guideTimer;
let guideHover = false;
const guidePointers = new Set();
let guideTouchStart = null;

function scheduleGuide(delay = 4000) {
  clearTimeout(guideTimer);
  if (reducedMotion.matches || document.hidden || guidePointers.size ||
      guideHover || guideCarousel.contains(document.activeElement)) return;
  guideTimer = setTimeout(() => {
    showGuide(guideIndex + 1, false);
    scheduleGuide();
  }, delay);
}
function showGuide(index, announce = true) {
  guideIndex = (index + guidePages.length) % guidePages.length;
  guideTrack.style.transform = `translateX(-${guideIndex * 100}%)`;
  guidePages.forEach((page, i) => {
    page.setAttribute('aria-hidden', String(i !== guideIndex));
    page.inert = i !== guideIndex;
  });
  [...guideDots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === guideIndex)));
  const status = guideCarousel.querySelector('.guide-status');
  status.setAttribute('aria-live', announce ? 'polite' : 'off');
  status.textContent = `Prévia ${guideIndex + 1} de ${guidePages.length}`;
}
function pauseGuide() { scheduleGuide(10000); }
guidePages.forEach((page, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Mostrar prévia ${i + 1} de ${guidePages.length}`);
  dot.addEventListener('click', () => { showGuide(i); pauseGuide(); });
  guideDots.append(dot);
});
guideCarousel.querySelector('.guide-previous').addEventListener('click', () => { showGuide(guideIndex - 1); pauseGuide(); });
guideCarousel.querySelector('.guide-next').addEventListener('click', () => { showGuide(guideIndex + 1); pauseGuide(); });
guideCarousel.addEventListener('pointerdown', event => {
  guidePointers.add(event.pointerId);
  if (guidePointers.size === 1 && event.target.closest('.guide-window')) {
    guideTouchStart = { x: event.clientX, y: event.clientY };
  } else guideTouchStart = null;
  clearTimeout(guideTimer);
});
function releaseGuide(event) {
  if (!guidePointers.has(event.pointerId)) return;
  guidePointers.delete(event.pointerId);
  if (event.type === 'pointerup' && guideTouchStart) {
    const deltaX = event.clientX - guideTouchStart.x;
    const deltaY = event.clientY - guideTouchStart.y;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      showGuide(guideIndex + (deltaX < 0 ? 1 : -1));
    }
  }
  guideTouchStart = null;
  pauseGuide();
}
window.addEventListener('pointerup', releaseGuide);
window.addEventListener('pointercancel', releaseGuide);
guideCarousel.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'mouse') return;
  guideHover = true;
  clearTimeout(guideTimer);
});
guideCarousel.addEventListener('pointerleave', event => {
  if (event.pointerType !== 'mouse') return;
  guideHover = false;
  pauseGuide();
});
guideCarousel.addEventListener('focusin', () => clearTimeout(guideTimer));
guideCarousel.addEventListener('focusout', () => requestAnimationFrame(pauseGuide));
guideCarousel.addEventListener('wheel', pauseGuide, { passive: true });
guideCarousel.addEventListener('keydown', event => {
  if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault();
    showGuide(guideIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
  pauseGuide();
});
document.addEventListener('visibilitychange', pauseGuide);
reducedMotion.addEventListener('change', pauseGuide);
showGuide(0, false);
scheduleGuide();

document.querySelectorAll('.faq').forEach(item => item.addEventListener('toggle', () => {
  if (item.open) document.querySelectorAll('.faq').forEach(other => {
    if (other !== item) other.open = false;
  });
}));
