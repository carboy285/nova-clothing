import keepClimbingFallbackImage from './assets/keep-climbing-mountain-tee-front.jpg?url';
import mountainsWaitFallbackImage from './assets/mountains-wait-tee-front.jpg?url';
import novaResetFallbackImage from './assets/nova-reset-tee-front.jpg?url';
import keepClimbingCapFallbackImage from './assets/keep-climbing-baseball-cap-front.jpg?url';
import logoFallbackImage from './assets/nova-logo-full.png?url';

document.addEventListener('DOMContentLoaded', () => {
  const cartStorageKey = 'nova-cart';
  const squareStoreUrl = 'https://shop-nova-clothing.square.site/';
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const productCatalog = {
    'keep-climbing-cap': {
      name: 'Keep Climbing Baseball Cap',
      url: './keep-climbing-baseball-cap.html',
      squareUrl: `${squareStoreUrl}shop/nova-treking-collection/C4JR5KKWC5PKC6NJCYPYW53E`,
    },
    'keep-climbing-tee': {
      name: 'Keep Climbing Mountain graphic Tee',
      url: './keep-climbing-mountain-tee.html',
      squareUrl: `${squareStoreUrl}shop/nova-treking-collection/C4JR5KKWC5PKC6NJCYPYW53E`,
    },
    'mountains-wait-tee': {
      name: 'Mountains Wait We Don\'t T-Shirt',
      url: './mountains-wait-we-dont-tee.html',
      squareUrl: `${squareStoreUrl}product/mountains-wait-we-don-t-t-shirt-adventure-hiking-graphic-tee/65BMT2BAZGI4Y3SJ73MTDY2C`,
    },
    'nova-reset-tee': {
      name: 'NOVA Reset Tee',
      url: './nova-reset-tee.html',
      squareUrl: `${squareStoreUrl}shop/nova-treking-collection/C4JR5KKWC5PKC6NJCYPYW53E`,
    },
    'focus-tee': {
      name: 'Focus Tee',
      url: './focus-tee.html',
      squareUrl: `${squareStoreUrl}product/courage-definition-tee-minimal-inspirational-graphic-t-shirt/B6TXU3GE3BZIQTN5HKAH7ZMB`,
    },
    'growth-tee': {
      name: 'Growth Tee',
      url: './growth-tee.html',
      squareUrl: `${squareStoreUrl}shop/defined/HARTQ3CIETG2LDLOCADT25HM`,
    },
    'discipline-crew': {
      name: 'Discipline Crew',
      url: './discipline-crew.html',
      squareUrl: `${squareStoreUrl}shop/defined/HARTQ3CIETG2LDLOCADT25HM`,
    },
    'resilience-hoodie': {
      name: 'Resilience Hoodie',
      url: './resilience-hoodie.html',
      squareUrl: `${squareStoreUrl}shop/defined/HARTQ3CIETG2LDLOCADT25HM`,
    },
  };

  const searchProducts = Object.values(productCatalog);

  const productImageFallbacks = {
    'keep-climbing-cap': keepClimbingCapFallbackImage,
    'keep-climbing-tee': keepClimbingFallbackImage,
    'mountains-wait-tee': mountainsWaitFallbackImage,
    'nova-reset-tee': novaResetFallbackImage,
  };

  const logoImageFallback = logoFallbackImage;

  const escapeHTML = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  let cartOverlay = null;
  let cartDrawer = null;

  const getProductSquareUrl = (productId) => (
    productCatalog[productId]?.squareUrl || squareStoreUrl
  );

  document.querySelectorAll('[data-nova-menu-toggle]').forEach((toggle) => {
    const nav = document.querySelector(toggle.getAttribute('aria-controls') ? `#${toggle.getAttribute('aria-controls')}` : '[data-nova-mobile-nav]');
    if (!nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.toggleAttribute('data-open', !isOpen);
    });
  });

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
      || sourcePath.endsWith('/assets/keep-climbing-baseball-cap-front.jpg')
      || sourcePath.endsWith('/assets/mountains-wait-tee-front.jpg')
      || sourcePath.endsWith('/assets/nova-reset-tee-front.jpg')
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
      || resolveImageSource(document.querySelector('.nova-word-card--large'))
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

    if (marker.includes('baseball cap')) return productImageFallbacks['keep-climbing-cap'];
    if (marker.includes('keep climbing')) return productImageFallbacks['keep-climbing-tee'];
    if (marker.includes('mountains wait')) return productImageFallbacks['mountains-wait-tee'];
    if (marker.includes('nova reset')) return productImageFallbacks['nova-reset-tee'];
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

  const updateCheckoutButton = (cart) => {
    const checkoutButton = cartDrawer?.querySelector('[data-cart-checkout]');
    const checkoutNote = cartDrawer?.querySelector('[data-cart-checkout-note]');
    if (!checkoutButton) return;

    if (!cart.length) {
      checkoutButton.setAttribute('disabled', '');
      checkoutButton.textContent = 'Continue to Square Store';
      if (checkoutNote) checkoutNote.hidden = true;
      return;
    }

    checkoutButton.removeAttribute('disabled');

    if (cart.length === 1) {
      checkoutButton.textContent = 'Checkout on Square';
      if (checkoutNote) {
        checkoutNote.hidden = false;
        checkoutNote.textContent = 'You will finish size and payment on Square.';
      }
      return;
    }

    checkoutButton.textContent = 'Open Square Store';
    if (checkoutNote) {
      checkoutNote.hidden = false;
      checkoutNote.textContent = 'Square checkout opens each item below. Select your size on Square to complete purchase.';
    }
  };

  const handleCheckout = () => {
    const cart = getCart();
    if (!cart.length) return;

    if (cart.length === 1) {
      window.open(getProductSquareUrl(cart[0].id), '_blank', 'noopener,noreferrer');
      return;
    }

    const opened = new Set();
    cart.forEach((item) => {
      const url = getProductSquareUrl(item.id);
      if (opened.has(url)) return;
      opened.add(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  };

  const renderCart = () => {
    if (!cartDrawer) return;

    const cart = getCart();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsWrapper = cartDrawer.querySelector('[data-cart-items]');

    document.querySelectorAll('[data-cart-count]').forEach((count) => {
      count.textContent = String(itemCount);
      count.toggleAttribute('data-empty', itemCount === 0);
    });

    cartDrawer.querySelector('[data-cart-total]').textContent = money.format(total);
    updateCheckoutButton(cart);

    if (!cart.length) {
      itemsWrapper.innerHTML = '<p class="nova-empty-cart">Your cart is empty. Add a product to start your NOVA order.</p>';
      return;
    }

    const normalizedCart = cart.map((item) => ({
      ...item,
      image: shouldUseProductFallback(item) ? getProductFallbackImage(item.id) : item.image,
      squareUrl: getProductSquareUrl(item.id),
    }));

    if (JSON.stringify(normalizedCart.map(({ squareUrl, ...item }) => item)) !== JSON.stringify(cart)) {
      saveCart(normalizedCart.map(({ squareUrl, ...item }) => item));
    }

    itemsWrapper.innerHTML = normalizedCart.map((item) => `
      <article class="nova-cart-item">
        ${item.image ? `<img src="${escapeHTML(item.image)}" alt="" data-cart-item-image data-fallback-image="${escapeHTML(getProductFallbackImage(item.id))}">` : '<div class="nova-cart-item__placeholder" aria-hidden="true"></div>'}
        <div>
          <h3>${escapeHTML(item.name)}</h3>
          <p>Size ${escapeHTML(item.size)} / ${money.format(item.price)}</p>
          <div class="nova-cart-controls">
            <button type="button" data-cart-qty="${escapeHTML(item.key)}" data-cart-delta="-1">-</button>
            <strong>${item.quantity}</strong>
            <button type="button" data-cart-qty="${escapeHTML(item.key)}" data-cart-delta="1">+</button>
            <button type="button" data-cart-remove="${escapeHTML(item.key)}">Remove</button>
          </div>
          <a class="nova-cart-item__square" href="${escapeHTML(item.squareUrl)}" target="_blank" rel="noreferrer">View on Square</a>
        </div>
      </article>
    `).join('');
    repairBrokenCartImages();
  };

  const initCart = () => {
    const syncSelectedProductPrice = (sizeButton) => {
      if (!sizeButton) return;

      const addButton = document.querySelector('.nova-product-actions [data-add-to-cart]');
      const priceDisplay = document.querySelector('[data-product-price-display]');
      const nextPrice = Number(sizeButton.dataset.price || 0);

      if (addButton) {
        addButton.dataset.productSize = sizeButton.dataset.size;
        addButton.dataset.productPrice = sizeButton.dataset.price;
        if (sizeButton.dataset.sku) {
          addButton.dataset.productSku = sizeButton.dataset.sku;
        }
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
        <p class="nova-cart-checkout-note" data-cart-checkout-note hidden></p>
        <button class="nova-button nova-button--dark nova-button--wide" type="button" data-cart-checkout disabled>Continue to Square Store</button>
      </div>
    `;

    document.body.append(cartOverlay, cartDrawer);

    document.querySelectorAll('[data-cart-open]').forEach((button) => {
      button.addEventListener('click', openCart);
    });

    cartOverlay.addEventListener('click', closeCart);
    cartDrawer.querySelector('[data-cart-close]').addEventListener('click', closeCart);
    cartDrawer.querySelector('[data-cart-checkout]').addEventListener('click', handleCheckout);

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
          sku: button.dataset.productSku || '',
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

  const initSearch = () => {
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'nova-search-overlay';

    const searchModal = document.createElement('div');
    searchModal.className = 'nova-search-modal';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'nova-search-input';
    searchInput.placeholder = 'Search products\u2026';
    searchInput.setAttribute('aria-label', 'Search products');

    const searchResultsList = document.createElement('ul');
    searchResultsList.className = 'nova-search-results';

    searchModal.append(searchInput, searchResultsList);
    searchOverlay.appendChild(searchModal);
    document.body.appendChild(searchOverlay);

    const renderSearchResults = (query) => {
      const q = (query || '').trim().toLowerCase();
      const matches = q
        ? searchProducts.filter((product) => product.name.toLowerCase().includes(q))
        : searchProducts;

      if (!matches.length) {
        searchResultsList.innerHTML = '<li class="nova-search-empty">No products found.</li>';
        return;
      }

      searchResultsList.innerHTML = matches.map((product) =>
        `<li><a href="${escapeHTML(product.url)}">${escapeHTML(product.name)}</a></li>`
      ).join('');
    };

    const openSearch = () => {
      searchOverlay.setAttribute('data-open', '');
      searchInput.value = '';
      renderSearchResults('');
      requestAnimationFrame(() => searchInput.focus());
    };

    const closeSearch = () => {
      searchOverlay.removeAttribute('data-open');
    };

    searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));

    searchOverlay.addEventListener('click', (event) => {
      if (event.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && searchOverlay.hasAttribute('data-open')) closeSearch();
    });

    document.querySelectorAll('.nova-story-search, [data-search-open]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        openSearch();
      });
    });
  };

  document.querySelectorAll('[data-square-buy]').forEach((link) => {
    const productId = link.dataset.squareBuy;
    const squareUrl = getProductSquareUrl(productId);
    if (squareUrl) link.href = squareUrl;
  });

  initCart();
  initSearch();
  initImageFallbacks();
  initRevealAnimations();
  initParallax();
});
