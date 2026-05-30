document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-nova-menu-toggle]').forEach((toggle) => {
    const nav = document.querySelector(toggle.getAttribute('aria-controls') ? `#${toggle.getAttribute('aria-controls')}` : '[data-nova-mobile-nav]');
    if (!nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.toggleAttribute('data-open', !isOpen);
    });
  });
});
