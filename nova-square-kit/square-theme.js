document.addEventListener('DOMContentLoaded', () => {
  const cartStorageKey = 'nova-cart';
  const checkoutUrl = 'https://shop-nova-clothing.square.site/';
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  document.querySelectorAll('[data-nova-menu-toggle]').forEach((toggle) => {
    const nav = document.querySelector(toggle.getAttribute('aria-controls') ? `#${toggle.getAttribute('aria-controls')}` : '[data-nova-mobile-nav]');
    if (!nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      nav.toggleAttribute('data-open', !isOpen);
    });
  });

  const cartOverlay = document.createElement('div');
  cartOverlay.className = 'nova-cart-overlay';
  cartOverlay.setAttribute('data-cart-close', '');

  const cartDrawer = document.createElement('aside');
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

  const openCart = () => {
    cartOverlay.setAttribute('data-open', '');
    cartDrawer.setAttribute('data-open', '');
  };

  const closeCart = () => {
    cartOverlay.removeAttribute('data-open');
    cartDrawer.removeAttribute('data-open');
  };

  const renderCart = () => {
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

    itemsWrapper.innerHTML = cart.map((item) => `
      <article class="nova-cart-item">
        <img src="${item.image}" alt="">
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
  };

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

      const addButton = document.querySelector('[data-add-to-cart][data-product-id="keep-climbing-tee"]');
      if (addButton) {
        addButton.dataset.productSize = button.dataset.size;
        addButton.dataset.productPrice = button.dataset.price;
      }
    });
  });

  document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const product = {
        id: button.dataset.productId,
        name: button.dataset.productName,
        size: button.dataset.productSize || 'M',
        price: Number(button.dataset.productPrice || 0),
        image: button.dataset.productImage,
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
});
