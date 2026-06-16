document.documentElement.classList.add('js-enhanced');

document.addEventListener('DOMContentLoaded', () => {
  const cartStorageKey = 'nova-cart';
  const checkoutUrl = 'https://shop-nova-clothing.square.site/';
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cartTriggers = document.querySelectorAll('[data-cart-open], [data-add-to-cart], [data-size-option]');
  const productImageFallbacks = {
    'keep-climbing-tee': new URL('./assets/keep-climbing-mountain-tee-front.jpg', import.meta.url).href,
    'mountains-wait-tee': new URL('./assets/mountains-wait-tee-front.jpg', import.meta.url).href,
  };
  const logoImageFallback = new URL('./assets/nova-logo-full.png', import.meta.url).href;
  const heroImageFallback = new URL('./assets/nova-mountain-hero.png', import.meta.url).href;

  document.querySelectorAll('[data-nova-menu-toggle]').forEach((toggle) => {
    const nav = document.querySelector(toggle.getAttribute('aria-controls') ? `#${toggle.getAttribute('aria-controls')}` : '[data-nova-mobile-nav]');
    if (!nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.toggleAttribute('data-open', !isOpen);
    });
  });

  let cartOverlay = null;
  let cartDrawer = null;

  const applyRevealDelays = () => {
    document.querySelectorAll('[data-reveal-group]').forEach((group) => {
      group.querySelectorAll('[data-reveal]').forEach((element, index) => {
        if (element.dataset.revealDelay) {
          element.style.setProperty('--nova-reveal-delay', element.dataset.revealDelay);
          return;
        }

        element.style.setProperty('--nova-reveal-delay', `${index * 120}ms`);
      });
    });
  };

  const initRevealAnimations = () => {
    applyRevealDelays();

    const revealTargets = document.querySelectorAll('[data-reveal]');
    if (!revealTargets.length) return;

    if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
      revealTargets.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    revealTargets.forEach((element) => element.classList.remove('is-visible'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    });

    revealTargets.forEach((element) => {
      observer.observe(element);
    });
  };

  const initParallax = () => {
    const parallaxTargets = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!parallaxTargets.length) return;

    if (reducedMotionQuery.matches) {
      parallaxTargets.forEach((element) => element.style.setProperty('--nova-parallax-shift', '0px'));
      return;
    }

    let ticking = false;

    const update = () => {
      const viewportHeight = window.innerHeight || 1;

      parallaxTargets.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const midpointOffset = rect.top + (rect.height / 2) - (viewportHeight / 2);
        const shift = Math.max(-20, Math.min(20, midpointOffset * -0.045));
        element.style.setProperty('--nova-parallax-shift', `${shift.toFixed(2)}px`);
      });

      ticking = false;
    };

    const requestTick = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    requestTick();
  };

  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem(cartStorageKey)) || [];
    } catch {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  };

  const getProductFallbackImage = (productId) => productImageFallbacks[productId] || '';

  const shouldUseProductFallback = (item) => {
    if (!item.image) return true;
    if (!item.id || !getProductFallbackImage(item.id)) return false;

    const sourcePath = item.image.split('?')[0];
    return (
      sourcePath.endsWith('/assets/keep-climbing-mountain-tee-front.jpg')
      || sourcePath.endsWith('/assets/mountains-wait-tee-front.jpg')
      || sourcePath.endsWith('/assets/mountains-wait-tee-front-v2.jpg')
      || sourcePath.endsWith('/assets/mountains-wait-tee-front-v3.jpg')
    );
  };

  const resolveImageSource = (image) => {
    if (!image) return '';
    return image.currentSrc || image.src || image.getAttribute('src') || '';
  };

  const resolveProductImage = (button) => {
    const productId = button.dataset.productId;
    return (
      resolveImageSource(button.closest('.nova-product-card')?.querySelector('img'))
      || resolveImageSource(document.querySelector('.nova-product-gallery__featured'))
      || button.dataset.productImage
      || getProductFallbackImage(productId)
    );
  };

  const repairBrokenCartImages = () => {
    cartDrawer?.querySelectorAll('[data-cart-item-image]').forEach((image) => {
      image.addEventListener('error', () => {
        const fallback = image.dataset.fallbackImage;
        if (fallback && image.src !== fallback) {
          image.src = fallback;
        }
      }, { once: true });
    });
  };

  const getImageFallback = (image) => {
    const marker = `${image.alt || ''} ${image.getAttribute('src') || ''}`.toLowerCase();

    if (marker.includes('keep climbing')) return productImageFallbacks['keep-climbing-tee'];
    if (marker.includes('mountains wait')) return productImageFallbacks['mountains-wait-tee'];
    if (marker.includes('nova clothing') || marker.includes('nova-logo-full')) return logoImageFallback;

    return '';
  };

  const applyImageFallback = (image) => {
    const fallback = getImageFallback(image);
    if (!fallback || image.dataset.novaFallbackApplied === 'true') return;

    image.dataset.novaFallbackApplied = 'true';
    image.src = fallback;
  };

  const initImageFallbacks = () => {
    document.querySelectorAll('img').forEach((image) => {
      image.addEventListener('error', () => applyImageFallback(image), { once: true });

      if (image.complete && image.naturalWidth === 0) {
        applyImageFallback(image);
      }
    });

    document.querySelectorAll('.nova-hero__image, .nova-banner__image, .nova-collection-hero__image').forEach((element) => {
      element.style.backgroundImage = `url("${heroImageFallback}")`;
    });
  };

  const openCart = () => {
    if (!cartOverlay || !cartDrawer) return;
    cartOverlay.setAttribute('data-open', '');
    cartDrawer.setAttribute('data-open', '');
  };

  const closeCart = () => {
    if (!cartOverlay || !cartDrawer) return;
    cartOverlay.removeAttribute('data-open');
    cartDrawer.removeAttribute('data-open');
  };

  const renderCart = () => {
    if (!cartDrawer) return;

    const cart = getCart();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsWrapper = cartDrawer.querySelector('[data-cart-items]');

    document.querySelectorAll('[data-cart-count]').forEach((count) => {
      count.textContent = String(itemCount);
    });

    cartDrawer.querySelector('[data-cart-total]').textContent = money.format(total);

    if (!cart.length) {
      itemsWrapper.innerHTML = '<p class="nova-empty-cart">Your cart is empty. Add a product to start your NOVA order.</p>';
      return;
    }

    const normalizedCart = cart.map((item) => ({
      ...item,
      image: shouldUseProductFallback(item) ? getProductFallbackImage(item.id) : item.image,
    }));

    if (JSON.stringify(normalizedCart) !== JSON.stringify(cart)) {
      saveCart(normalizedCart);
    }

    itemsWrapper.innerHTML = normalizedCart.map((item) => `
      <article class="nova-cart-item">
        <img src="${item.image}" alt="" data-cart-item-image data-fallback-image="${getProductFallbackImage(item.id)}">
        <div>
          <h3>${item.name}</h3>
          <p>Size ${item.size} / ${money.format(item.price)}</p>
          <div class="nova-cart-controls">
            <button type="button" data-cart-qty="${item.key}" data-cart-delta="-1">-</button>
            <strong>${item.quantity}</strong>
            <button type="button" data-cart-qty="${item.key}" data-cart-delta="1">+</button>
            <button type="button" data-cart-remove="${item.key}">Remove</button>
          </div>
        </div>
      </article>
    `).join('');
    repairBrokenCartImages();
  };

  const initCart = () => {
    if (!cartTriggers.length) return;

    const syncSelectedProductPrice = (sizeButton) => {
      if (!sizeButton) return;

      const addButton = document.querySelector('.nova-product-actions [data-add-to-cart]');
      const priceDisplay = document.querySelector('[data-product-price-display]');
      const nextPrice = Number(sizeButton.dataset.price || 0);

      if (addButton) {
        addButton.dataset.productSize = sizeButton.dataset.size;
        addButton.dataset.productPrice = sizeButton.dataset.price;
      }

      if (priceDisplay && nextPrice) {
        priceDisplay.textContent = money.format(nextPrice);
      }
    };

    cartOverlay = document.createElement('div');
    cartOverlay.className = 'nova-cart-overlay';
    cartOverlay.setAttribute('data-cart-close', '');

    cartDrawer = document.createElement('aside');
    cartDrawer.className = 'nova-cart-drawer';
    cartDrawer.setAttribute('aria-label', 'Shopping cart');
    cartDrawer.innerHTML = `
      <div class="nova-cart-drawer__header">
        <h2>Your Cart</h2>
        <button class="nova-icon-button" type="button" data-cart-close aria-label="Close cart">&times;</button>
      </div>
      <div class="nova-cart-items" data-cart-items></div>
      <div class="nova-cart-drawer__footer">
        <div class="nova-cart-total"><span>Subtotal</span><span data-cart-total>$0.00</span></div>
        <a class="nova-button nova-button--dark nova-button--wide" href="${checkoutUrl}" target="_blank" rel="noreferrer">Checkout on Square</a>
      </div>
    `;

    document.body.append(cartOverlay, cartDrawer);

    document.querySelectorAll('[data-cart-open]').forEach((button) => {
      button.addEventListener('click', openCart);
    });

    document.querySelectorAll('[data-cart-close]').forEach((button) => {
      button.addEventListener('click', closeCart);
    });

    document.querySelectorAll('[data-size-option]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-size-option]').forEach((option) => option.classList.remove('is-selected'));
        button.classList.add('is-selected');
        syncSelectedProductPrice(button);
      });
    });

    syncSelectedProductPrice(document.querySelector('[data-size-option].is-selected'));

    document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const product = {
          id: button.dataset.productId,
          name: button.dataset.productName,
          size: button.dataset.productSize || 'M',
          price: Number(button.dataset.productPrice || 0),
          image: resolveProductImage(button),
        };
        const key = `${product.id}-${product.size}`;
        const cart = getCart();
        const existing = cart.find((item) => item.key === key);

        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ ...product, key, quantity: 1 });
        }

        saveCart(cart);
        renderCart();
        openCart();
      });
    });

    cartDrawer.addEventListener('click', (event) => {
      const qtyButton = event.target.closest('[data-cart-qty]');
      const removeButton = event.target.closest('[data-cart-remove]');

      if (!qtyButton && !removeButton) return;

      const cart = getCart();
      const key = qtyButton?.dataset.cartQty || removeButton?.dataset.cartRemove;
      const nextCart = cart.flatMap((item) => {
        if (item.key !== key) return [item];
        if (removeButton) return [];

        const nextQuantity = item.quantity + Number(qtyButton.dataset.cartDelta);
        return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
      });

      saveCart(nextCart);
      renderCart();
    });

    renderCart();
  };

  initCart();
  initImageFallbacks();
  initRevealAnimations();
  initParallax();
});
