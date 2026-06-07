
'use strict';

/* ============================================================
   STATE — Single source of truth
   ============================================================ */
const State = {
  theme: localStorage.getItem('nexus-theme') || 'dark',
  cart: JSON.parse(localStorage.getItem('nexus-cart') || '[]'),
  currentPage: 'home',
  filters: {
    category: null,
    format: null,
    maxPrice: 200,
    search: '',
    rating: null,
    sort: 'popular'
  },
  carousel: { index: 0 },
  openProduct: null,
};

/* ============================================================
   DATA — Mock product catalog
   ============================================================ */
const CATEGORIES = [
  { id: 'ui', name: 'UI Kits', icon: '🎨' },
  { id: 'font', name: 'Fonts', icon: '✍️' },
  { id: 'template', name: 'Templates', icon: '📐' },
  { id: 'code', name: 'Code', icon: '🧩' },
  { id: 'icon', name: 'Icons', icon: '⚡' },
  { id: 'plugin', name: 'Plugins', icon: '🔌' },
];

const FORMATS = ['Figma', 'Sketch', 'React', 'Vue', 'SVG', 'OTF', 'ZIP', 'Next.js'];

const PRODUCTS = [
  { id:1, name:'Aurora UI Kit', author:'Studio Verse', price:49, oldPrice:89, category:'ui', format:'Figma', icon:'🎨', tags:['Figma','Design System'], rating:4.9, reviews:312, desc:'A complete design system with 624 hand-crafted components, 48 page templates, and a robust token architecture. Built for Figma with auto-layout and responsive variants.', features:['624 Components','48 Page Templates','Dark + Light Modes','Design Tokens','Auto-Layout Ready'] },
  { id:2, name:'SaaS Boilerplate Pro', author:'Devkit Labs', price:79, oldPrice:null, category:'code', format:'Next.js', icon:'🧩', tags:['Next.js','TypeScript'], rating:4.8, reviews:198, desc:'Ship your SaaS in days, not months. Includes auth, billing (Stripe), dashboard, and API layer — fully typed with TypeScript.', features:['Auth (NextAuth)','Stripe Billing','Admin Dashboard','API Routes','Fully Typed'] },
  { id:3, name:'Neue Geometric', author:'Typocraft', price:34, oldPrice:55, category:'font', format:'OTF', icon:'✍️', tags:['Font','Geometric'], rating:4.7, reviews:87, desc:'A contemporary geometric typeface with 12 weights. Inspired by Swiss modernism, built for the digital age. Includes matching italic cuts.', features:['12 Weights','Italic Cuts','OTF + WOFF2','Pan-European Glyphs','License: Commercial'] },
  { id:4, name:'Portfolio Folio', author:'Canvastudio', price:29, oldPrice:null, category:'template', format:'Figma', icon:'📐', tags:['Portfolio','Template'], rating:4.6, reviews:144, desc:'A minimal portfolio template built for creatives. Fully responsive, pixel-perfect, and ready to ship with your custom content.', features:['15 Page Designs','Mobile-First','Style Guide Included','Easy Customization','Lifetime Updates'] },
  { id:5, name:'Lumina Icon Set', author:'Pixel Monks', price:19, oldPrice:35, category:'icon', format:'SVG', icon:'⚡', tags:['Icons','SVG'], rating:4.9, reviews:502, desc:'3,200+ stroke icons in a consistent 24px grid. Available as SVG, Figma components, and React component library. Covers all major categories.', features:['3,200+ Icons','SVG + React','24px Grid','MIT License','Figma Library'] },
  { id:6, name:'Notion Dashboard Kit', author:'Workflow Co', price:14, oldPrice:null, category:'template', format:'Figma', icon:'📊', tags:['Dashboard','Notion'], rating:4.5, reviews:67, desc:'Professional Notion templates for freelancers and teams. Includes project tracker, client CRM, and invoice builder.', features:['5 Template Suites','Client CRM','Project Tracker','Invoice Builder','Video Walkthroughs'] },
  { id:7, name:'Shadcn Component Pack', author:'UIcraft', price:59, oldPrice:99, category:'code', format:'React', icon:'⚛️', tags:['React','Shadcn'], rating:4.8, reviews:231, desc:'60+ production-ready React components built on Shadcn/UI. Includes animated variants, form components, and data tables.', features:['60+ Components','Animated Variants','TypeScript','Tailwind CSS','Accessible (WCAG 2.1)'] },
  { id:8, name:'Logotype Starter Pack', author:'Brandcraft', price:24, oldPrice:40, category:'ui', format:'Figma', icon:'🏷️', tags:['Logo','Branding'], rating:4.4, reviews:93, desc:'50 customizable logo templates designed for modern brands. Edit everything from colors to typography in Figma.', features:['50 Logo Templates','Full Vector','Easy Editing','Brand Guidelines','Commercial License'] },
  { id:9, name:'Framer Motion Cookbook', author:'Animate.io', price:39, oldPrice:null, category:'code', format:'React', icon:'🎬', tags:['Animation','React'], rating:4.7, reviews:156, desc:'25 copy-paste Framer Motion animations: page transitions, scroll effects, hover states, and loading skeletons.', features:['25 Animations','Copy-Paste Ready','CodeSandbox Links','Video Explanations','Lifetime Access'] },
  { id:10, name:'Minimal Lato Serif', author:'Type House', price:44, oldPrice:70, category:'font', format:'OTF', icon:'🖋️', tags:['Font','Serif'], rating:4.6, reviews:74, desc:'An elegant serif typeface blending classical proportions with modern clarity. Ideal for editorial, branding, and luxury products.', features:['8 Weights','Display Cuts','OTF + WOFF2','Extended Glyphs','Commercial License'] },
  { id:11, name:'Plugin Suite — Figma', author:'FigTools', price:22, oldPrice:null, category:'plugin', format:'Figma', icon:'🔌', tags:['Plugin','Figma'], rating:4.5, reviews:188, desc:'Bundle of 8 essential Figma plugins: content generator, color palette builder, spacing checker, and more.', features:['8 Plugins','Content Generator','Color Builder','Spacing Checker','Regular Updates'] },
  { id:12, name:'E-commerce UI System', author:'Commerce Kit', price:89, oldPrice:149, category:'ui', format:'Figma', icon:'🛒', tags:['E-commerce','UI System'], rating:4.9, reviews:420, desc:'The most comprehensive e-commerce UI kit. 800+ screens, 300+ components, fully documented design tokens for Figma and code.', features:['800+ Screens','300+ Components','Design Tokens','Figma Variables','Developer Handoff Docs'] },
];

const ORDERS = [
  { id:'#NXS-4821', product:'Aurora UI Kit', date:'Jun 3, 2026', amount:49, status:'complete', icon:'🎨', format:'Figma' },
  { id:'#NXS-4720', product:'Lumina Icon Set', date:'May 28, 2026', amount:19, status:'complete', icon:'⚡', format:'SVG' },
  { id:'#NXS-4615', product:'SaaS Boilerplate Pro', date:'May 14, 2026', amount:79, status:'complete', icon:'🧩', format:'Next.js' },
  { id:'#NXS-4410', product:'Portfolio Folio', date:'Apr 30, 2026', amount:29, status:'complete', icon:'📐', format:'Figma' },
];

const ADMIN_ORDERS = [
  { id:'#NXS-4830', product:'E-commerce UI System', customer:'sarah@example.com', amount:89, date:'Jun 5, 2026', status:'complete' },
  { id:'#NXS-4829', product:'SaaS Boilerplate Pro', customer:'jay@example.com', amount:79, date:'Jun 5, 2026', status:'processing' },
  { id:'#NXS-4828', product:'Aurora UI Kit', customer:'mira@example.com', amount:49, date:'Jun 4, 2026', status:'complete' },
  { id:'#NXS-4827', product:'Neue Geometric', customer:'tom@example.com', amount:34, date:'Jun 4, 2026', status:'pending' },
  { id:'#NXS-4826', product:'Lumina Icon Set', customer:'zara@example.com', amount:19, date:'Jun 3, 2026', status:'complete' },
];

/* ============================================================
   RENDER HELPERS
   ============================================================ */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const el = (tag, cls, html) => { const e = document.createElement(tag); if(cls) e.className=cls; if(html) e.innerHTML=html; return e; };

function statusBadge(status) {
  const map = { complete:'success', processing:'processing', pending:'pending' };
  const label = { complete:'Delivered', processing:'Processing', pending:'Pending' };
  return `<span class="status-badge status-badge--${map[status]}"><span class="status-dot"></span>${label[status]}</span>`;
}

function productCardHTML(p) {
  const gradients = ['linear-gradient(135deg,#667eea,#764ba2)','linear-gradient(135deg,#f093fb,#f5576c)','linear-gradient(135deg,#4facfe,#00f2fe)','linear-gradient(135deg,#43e97b,#38f9d7)','linear-gradient(135deg,#fa709a,#fee140)','linear-gradient(135deg,#a18cd1,#fbc2eb)'];
  const grad = gradients[p.id % gradients.length];
  return `
    <article class="product-card" data-product-id="${p.id}" role="listitem" tabindex="0" aria-label="${p.name}">
      <div class="product-card__thumb" style="background:${grad}">
        <span>${p.icon}</span>
        <div class="product-card__thumb-gradient" style="background:linear-gradient(to top,rgba(0,0,0,0.4),transparent)"></div>
        <div class="product-card__actions-overlay">
          <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${p.id}" aria-label="Add ${p.name} to cart">Add to Cart</button>
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__tags">
          ${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
        </div>
        <h3 class="product-card__name">${p.name}</h3>
        <div class="product-card__author">by ${p.author}</div>
        <div class="product-card__footer">
          <div>
            <span class="product-card__price">$${p.price}</span>
            ${p.oldPrice?`<span class="product-card__price-old">$${p.oldPrice}</span>`:''}
          </div>
          <div class="product-card__rating">
            <span class="rating-stars">★★★★${p.rating>=5?'★':'☆'}</span>
            ${p.rating} (${p.reviews})
          </div>
        </div>
      </div>
    </article>`;
}

/* ============================================================
   THEME SYSTEM
   ============================================================ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('nexus-theme', theme);
  State.theme = theme;
}

$('#themeToggle').addEventListener('click', () => {
  applyTheme(State.theme === 'dark' ? 'light' : 'dark');
});

applyTheme(State.theme);

/* ============================================================
   NAVIGATION / PAGE ROUTING
   ============================================================ */
function navigateTo(pageId) {
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav__link').forEach(l => l.classList.remove('active'));

  const target = $(`#page-${pageId}`);
  if (target) target.classList.add('active');

  const navLink = $(`.nav__link[data-page="${pageId}"]`);
  if (navLink) navLink.classList.add('active');

  // Show/hide footer for admin
  $('#site-footer').style.display = pageId === 'admin' ? 'none' : '';

  State.currentPage = pageId;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageId === 'discover') renderDiscovery();
  if (pageId === 'checkout') renderCheckout();
  if (pageId === 'account') renderAccount();
  if (pageId === 'admin') renderAdmin();
}

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-page]');
  if (btn) {
    e.preventDefault();
    navigateTo(btn.dataset.page);
  }
});

// Nav scroll effect
window.addEventListener('scroll', () => {
  $('#nav').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================================
   CART MANAGEMENT
   ============================================================ */
function saveCart() {
  localStorage.setItem('nexus-cart', JSON.stringify(State.cart));
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === +productId);
  if (!product) return;
  const existing = State.cart.find(i => i.id === product.id);
  if (existing) {
    showToast('Already in cart!', '✓');
    return;
  }
  State.cart.push({ ...product });
  saveCart();
  updateCartUI();
  showToast(`"${product.name}" added to cart`, '✓');
}

function removeFromCart(productId) {
  State.cart = State.cart.filter(i => i.id !== +productId);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const count = State.cart.length;
  const badge = $('#cartBadge');
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
  $('#cartDrawerCount').textContent = `${count} item${count!==1?'s':''}`;
}

function renderCartItems() {
  const container = $('#cartItems');
  if (State.cart.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:var(--space-2xl) 0;color:var(--text-muted)">
      <div style="font-size:2rem;margin-bottom:var(--space-md)">🛒</div>
      <div style="font-size:0.82rem">Your cart is empty</div>
      <button class="btn btn-ghost btn-sm" style="margin-top:var(--space-md)" data-page="discover">Browse Products</button>
    </div>`;
    $('#cartSummaryTotal').innerHTML = '';
    return;
  }
  container.innerHTML = State.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__thumb">${item.icon}</div>
      <div style="flex:1;min-width:0">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__format">${item.format} · Digital Download</div>
        <div class="cart-item__price">$${item.price}</div>
      </div>
      <button class="cart-item__remove" data-remove="${item.id}" aria-label="Remove ${item.name}">✕</button>
    </div>
  `).join('');

  const subtotal = State.cart.reduce((s,i) => s+i.price, 0);
  $('#cartSummaryTotal').innerHTML = `
    <div class="cart-summary-row"><span>Subtotal</span><span>$${subtotal}</span></div>
    <div class="cart-summary-row"><span>Processing fee</span><span>$0.00</span></div>
    <div class="cart-summary-row total"><span>Total</span><span>$${subtotal}</span></div>
  `;

  container.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.remove));
  });
}

function openCart() {
  $('#cartOverlay').classList.add('open');
  $('#cartDrawer').classList.add('open');
  renderCartItems();
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  $('#cartOverlay').classList.remove('open');
  $('#cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

$('#cartBtn').addEventListener('click', openCart);
$('#cartClose').addEventListener('click', closeCart);
$('#cartOverlay').addEventListener('click', closeCart);
$('#checkoutBtn').addEventListener('click', () => { closeCart(); navigateTo('checkout'); });

/* ============================================================
   PRODUCT MODAL
   ============================================================ */
function openProductModal(productId) {
  const p = PRODUCTS.find(x => x.id === +productId);
  if (!p) return;
  State.openProduct = p;

  $('#modalThumb').textContent = p.icon;
  $('#modalProductTitle').textContent = p.name;
  $('#modalDesc').textContent = p.desc;
  $('#modalPrice').textContent = `$${p.price}`;
  $('#modalOldPrice').textContent = p.oldPrice ? `$${p.oldPrice}` : '';
  $('#modalTags').innerHTML = p.tags.map(t=>`<span class="tag">${t}</span>`).join('');
  $('#modalFeatures').innerHTML = p.features.map(f=>`
    <div class="modal-feature">
      <span class="modal-feature-icon">✓</span>
      <span>${f}</span>
    </div>
  `).join('');

  $('#productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

$('#modalClose').addEventListener('click', () => {
  $('#productModal').classList.remove('open');
  document.body.style.overflow = '';
});
$('#productModal').addEventListener('click', e => {
  if (e.target === $('#productModal')) {
    $('#productModal').classList.remove('open');
    document.body.style.overflow = '';
  }
});
$('#modalAddToCart').addEventListener('click', () => {
  if (State.openProduct) {
    addToCart(State.openProduct.id);
    $('#productModal').classList.remove('open');
    document.body.style.overflow = '';
    openCart();
  }
});

/* ============================================================
   DELEGATE: Add to Cart, Product Click
   ============================================================ */
document.addEventListener('click', e => {
  if (e.target.closest('.add-to-cart-btn')) {
    e.stopPropagation();
    const btn = e.target.closest('.add-to-cart-btn');
    addToCart(btn.dataset.id);
    return;
  }
  const card = e.target.closest('.product-card[data-product-id]');
  if (card) openProductModal(card.dataset.productId);
});

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, icon = 'ℹ️') {
  const toast = el('div', 'toast');
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  $('#toastContainer').appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s reverse both';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ============================================================
   HOME PAGE: Categories & Carousel
   ============================================================ */
function renderHome() {
  // Categories
  const grid = $('#categoriesGrid');
  grid.innerHTML = CATEGORIES.map(c => `
    <button class="category-card" data-category="${c.id}" role="listitem" aria-label="Browse ${c.name}">
      <span class="category-card__icon">${c.icon}</span>
      <span class="category-card__name">${c.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.category-card').forEach(btn => {
    btn.addEventListener('click', () => {
      State.filters.category = btn.dataset.category;
      navigateTo('discover');
    });
  });

  // Featured Carousel
  const carousel = $('#featuredCarousel');
  const featured = PRODUCTS.slice(0, 6);
  carousel.innerHTML = featured.map(p => productCardHTML(p)).join('');

  // Carousel dots
  const dotsContainer = $('#carouselDots');
  dotsContainer.innerHTML = featured.map((_,i) => `<button class="carousel-dot${i===0?' active':''}" data-dot="${i}" aria-label="Go to slide ${i+1}"></button>`).join('');

  updateCarousel();
}

function updateCarousel() {
  const carousel = $('#featuredCarousel');
  const cards = carousel.querySelectorAll('.product-card');
  if (!cards.length) return;
  const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(carousel).gap);
  const maxIndex = Math.max(0, cards.length - Math.floor(carousel.parentElement.offsetWidth / cardWidth));
  State.carousel.index = Math.min(State.carousel.index, maxIndex);
  carousel.style.transform = `translateX(-${State.carousel.index * cardWidth}px)`;
  $$('#carouselDots .carousel-dot').forEach((d,i) => d.classList.toggle('active', i===State.carousel.index));
}

$('#carouselNext').addEventListener('click', () => {
  State.carousel.index++;
  updateCarousel();
});
$('#carouselPrev').addEventListener('click', () => {
  State.carousel.index = Math.max(0, State.carousel.index - 1);
  updateCarousel();
});
document.addEventListener('click', e => {
  const dot = e.target.closest('#carouselDots .carousel-dot');
  if (dot) { State.carousel.index = +dot.dataset.dot; updateCarousel(); }
});
window.addEventListener('resize', updateCarousel, { passive: true });

/* ============================================================
   DISCOVERY PAGE
   ============================================================ */
function renderDiscovery() {
  // Category filters
  const catContainer = $('#filterCategories');
  catContainer.innerHTML = `
    <button class="tag ${!State.filters.category?'active':''}" data-filter-cat="">All</button>
    ${CATEGORIES.map(c => `<button class="tag ${State.filters.category===c.id?'active':''}" data-filter-cat="${c.id}">${c.icon} ${c.name}</button>`).join('')}
  `;
  catContainer.querySelectorAll('[data-filter-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      State.filters.category = btn.dataset.filterCat || null;
      renderDiscovery();
    });
  });

  // Format filters
  const fmtContainer = $('#filterFormats');
  fmtContainer.innerHTML = FORMATS.map(f =>
    `<button class="tag ${State.filters.format===f?'active':''}" data-filter-fmt="${f}">${f}</button>`
  ).join('');
  fmtContainer.querySelectorAll('[data-filter-fmt]').forEach(btn => {
    btn.addEventListener('click', () => {
      State.filters.format = State.filters.format === btn.dataset.filterFmt ? null : btn.dataset.filterFmt;
      renderDiscovery();
    });
  });

  // Rating filters
  const ratingContainer = $('#filterRatings');
  ratingContainer.innerHTML = [5,4,3].map(r =>
    `<button class="tag ${State.filters.rating===r?'active':''}" data-filter-rating="${r}" style="font-size:0.7rem">
      ${'★'.repeat(r)}${'☆'.repeat(5-r)} & up
    </button>`
  ).join('');
  ratingContainer.querySelectorAll('[data-filter-rating]').forEach(btn => {
    btn.addEventListener('click', () => {
      State.filters.rating = State.filters.rating === +btn.dataset.filterRating ? null : +btn.dataset.filterRating;
      renderDiscovery();
    });
  });

  renderProducts();
}

$('#priceRange').addEventListener('input', e => {
  State.filters.maxPrice = +e.target.value;
  $('#priceMax').textContent = `$${e.target.value}`;
  renderProducts();
});

$('#searchInput').addEventListener('input', e => {
  State.filters.search = e.target.value.toLowerCase();
  renderProducts();
});

$('#sortSelect').addEventListener('change', e => {
  State.filters.sort = e.target.value;
  renderProducts();
});

function renderProducts() {
  let products = [...PRODUCTS];

  if (State.filters.category) products = products.filter(p => p.category === State.filters.category);
  if (State.filters.format) products = products.filter(p => p.format === State.filters.format);
  if (State.filters.maxPrice < 200) products = products.filter(p => p.price <= State.filters.maxPrice);
  if (State.filters.search) products = products.filter(p =>
    p.name.toLowerCase().includes(State.filters.search) ||
    p.author.toLowerCase().includes(State.filters.search) ||
    p.tags.some(t => t.toLowerCase().includes(State.filters.search))
  );
  if (State.filters.rating) products = products.filter(p => p.rating >= State.filters.rating);

  switch(State.filters.sort) {
    case 'price-asc': products.sort((a,b) => a.price-b.price); break;
    case 'price-desc': products.sort((a,b) => b.price-a.price); break;
    case 'newest': products.sort((a,b) => b.id-a.id); break;
    case 'rating': products.sort((a,b) => b.rating-a.rating); break;
    default: products.sort((a,b) => b.reviews-a.reviews);
  }

  $('#productsCount').textContent = `${products.length} products`;
  const grid = $('#productsGrid');
  grid.innerHTML = products.length
    ? products.map(p => productCardHTML(p)).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:var(--space-2xl);color:var(--text-muted)">
        <div style="font-size:2rem;margin-bottom:var(--space-md)">🔍</div>
        No products match your filters.
      </div>`;
}

/* ============================================================
   CHECKOUT PAGE
   ============================================================ */
function renderCheckout() {
  const items = State.cart;
  const itemsEl = $('#checkoutItems');
  const summaryEl = $('#checkoutSummary');

  if (items.length === 0) {
    itemsEl.innerHTML = `<p style="color:var(--text-muted);font-size:0.82rem">No items in cart. <button style="color:var(--accent);text-decoration:underline;background:none;border:none;cursor:pointer" data-page="discover">Browse products</button></p>`;
    summaryEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = items.map(item => `
    <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-sm) 0;border-bottom:1px solid var(--border)">
      <span style="font-size:1.4rem">${item.icon}</span>
      <div style="flex:1">
        <div style="font-family:var(--font-display);font-size:0.88rem;font-weight:700">${item.name}</div>
        <div style="font-size:0.7rem;color:var(--text-muted)">${item.format}</div>
      </div>
      <div style="font-family:var(--font-display);font-weight:800">$${item.price}</div>
    </div>
  `).join('');

  const subtotal = items.reduce((s,i) => s+i.price, 0);
  summaryEl.innerHTML = `
    <div class="cart-summary-row"><span>Subtotal</span><span>$${subtotal}</span></div>
    <div class="cart-summary-row"><span>Processing fee</span><span>$0.00</span></div>
    <div class="cart-summary-row total"><span>Total</span><span>$${subtotal}</span></div>
  `;
}

// Payment method toggle
document.querySelectorAll('.payment-method').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.payment-method').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
    this.classList.add('active');
    this.setAttribute('aria-pressed','true');
  });
});

// Card number formatting
$('#cardNumber').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').slice(0,16);
  this.value = v.match(/.{1,4}/g)?.join(' ') || v;
});
$('#cardExpiry').addEventListener('input', function() {
  let v = this.value.replace(/\D/g,'').slice(0,4);
  if (v.length >= 2) v = v.slice(0,2) + ' / ' + v.slice(2);
  this.value = v;
});

$('#placeOrderBtn').addEventListener('click', () => {
  if (!$('#cardNumber').value || !$('#billingEmail').value) {
    showToast('Please fill in all required fields', '⚠️');
    return;
  }
  State.cart = [];
  saveCart();
  updateCartUI();
  showToast('Order placed! Check your email 🎉', '✓');
  setTimeout(() => navigateTo('account'), 1500);
});

/* ============================================================
   ACCOUNT PAGE
   ============================================================ */
function renderAccount() {
  const list = $('#ordersList');
  list.innerHTML = ORDERS.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id">${order.id}</div>
          <div class="order-date" style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">${order.date}</div>
        </div>
        <div style="display:flex;align-items:center;gap:var(--space-md)">
          <div style="font-family:var(--font-display);font-weight:800">$${order.amount}</div>
          ${statusBadge(order.status)}
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:var(--space-md)">
          <span style="font-size:1.4rem">${order.icon}</span>
          <div>
            <div style="font-family:var(--font-display);font-size:0.9rem;font-weight:700">${order.product}</div>
            <div style="font-size:0.7rem;color:var(--text-muted)">${order.format} · Digital Download</div>
          </div>
        </div>
        <button class="download-btn" aria-label="Download ${order.product}">
          ↓ Download
        </button>
      </div>
    </div>
  `).join('');

  $$('[data-account]').forEach(btn => {
    btn.addEventListener('click', function() {
      $$('[data-account]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      showToast(`Switched to ${this.textContent.trim()}`, 'ℹ️');
    });
  });
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function renderAdmin() {
  // Stat Cards
  const stats = [
    { label:'Total Revenue', value:'$24,890', change:'+18.4%', trend:'up' },
    { label:'Products Sold', value:'1,284', change:'+12.1%', trend:'up' },
    { label:'Active Listings', value:'48', change:'+3', trend:'up' },
    { label:'Refund Rate', value:'0.8%', change:'-0.2%', trend:'up' },
  ];
  $('#adminStats').innerHTML = stats.map((s,i) => `
    <div class="stat-card">
      <div class="stat-card__label">${s.label}</div>
      <div class="stat-card__value">${s.value}</div>
      <div class="stat-card__change ${s.trend==='down'?'down':''}">${s.change} this month</div>
      <svg class="stat-card__sparkline" viewBox="0 0 80 40">
        <polyline points="${Array.from({length:8},(_,j)=>`${j*12},${20+Math.sin(j*1.2+i)*10+Math.random()*6}`).join(' ')}" fill="none" stroke="${getComputedStyle(document.documentElement).getPropertyValue('--accent')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `).join('');

  // Revenue Chart (SVG)
  renderRevenueChart();

  // Orders Table
  const months = ['Jan','Feb','Mar','Apr','May','Jun'];
  const tbody = $('#ordersTableBody');
  tbody.innerHTML = ADMIN_ORDERS.map(order => `
    <tr>
      <td style="font-family:var(--font-display);font-size:0.78rem;font-weight:700;color:var(--text-primary)">${order.id}</td>
      <td>${order.product}</td>
      <td>${order.customer}</td>
      <td style="font-family:var(--font-display);font-weight:700;color:var(--text-primary)">$${order.amount}</td>
      <td>${order.date}</td>
      <td>${statusBadge(order.status)}</td>
      <td><button class="btn btn-ghost btn-sm">View</button></td>
    </tr>
  `).join('');

  // Chart tabs
  $$('.chart-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      $$('.chart-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderRevenueChart();
    });
  });

  // Admin nav
  $$('.admin-nav-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      $$('.admin-nav-icon').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function renderRevenueChart() {
  const svg = $('#revenueChart');
  const W = 900, H = 200;
  const data = [18400, 21200, 19800, 23100, 20500, 24890, 22100, 26400];
  const labels = ['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
  const max = Math.max(...data);
  const min = Math.min(...data) * 0.8;
  const range = max - min;
  const pts = data.map((v,i) => ({
    x: 40 + i * ((W - 80) / (data.length - 1)),
    y: H - 20 - ((v - min) / range) * (H - 60)
  }));
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const pathD = `M ${pts.map(p=>`${p.x},${p.y}`).join(' L ')}`;
  const areaD = `M ${pts[0].x},${H - 20} L ${pts.map(p=>`${p.x},${p.y}`).join(' L ')} L ${pts[pts.length-1].x},${H - 20} Z`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${[0,0.25,0.5,0.75,1].map(t => {
      const y = H - 20 - t * (H - 60);
      return `<line x1="40" y1="${y}" x2="${W-40}" y2="${y}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>`;
    }).join('')}
    <path d="${areaD}" fill="url(#areaGrad)"/>
    <path d="${pathD}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${accent}" stroke="var(--bg-secondary)" stroke-width="2"/>`).join('')}
    ${labels.map((l,i) => `<text x="${pts[i].x}" y="${H}" text-anchor="middle" font-size="10" fill="var(--text-muted)" font-family="var(--font-body)">${l}</text>`).join('')}
    ${data.map((v,i) => `<text x="${pts[i].x}" y="${pts[i].y - 12}" text-anchor="middle" font-size="9" fill="var(--text-muted)" font-family="var(--font-body)">$${(v/1000).toFixed(0)}k</text>`).join('')}
  `;
}

/* ============================================================
   ADMIN: ADD PRODUCT MODAL
   ============================================================ */
$('#addProductBtn').addEventListener('click', () => {
  $('#addProductModal').classList.add('open');
  document.body.style.overflow = 'hidden';
});
$('#addProductClose').addEventListener('click', closeAddProductModal);
$('#addProductCancel').addEventListener('click', closeAddProductModal);
$('#addProductModal').addEventListener('click', e => { if(e.target===$('#addProductModal')) closeAddProductModal(); });

function closeAddProductModal() {
  $('#addProductModal').classList.remove('open');
  document.body.style.overflow = '';
}

$('#saveProductBtn').addEventListener('click', () => {
  const name = $('#newProductName').value.trim();
  const price = $('#newProductPrice').value;
  if (!name || !price) { showToast('Fill in product name and price', '⚠️'); return; }
  showToast(`"${name}" added to catalog ✓`, '✓');
  closeAddProductModal();
  $('#newProductName').value = '';
  $('#newProductPrice').value = '';
  $('#newProductDesc').value = '';
});

/* ============================================================
   KEYBOARD ACCESSIBILITY
   ============================================================ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart();
    $('#productModal').classList.remove('open');
    closeAddProductModal();
    document.body.style.overflow = '';
  }
  if (e.key === 'Enter' || e.key === ' ') {
    const card = document.activeElement.closest('.product-card[data-product-id]');
    if (card) { e.preventDefault(); openProductModal(card.dataset.productId); }
  }
});

/* ============================================================
   INITIALISE
   ============================================================ */
(function init() {
  renderHome();
  updateCartUI();
  navigateTo('home');
})();

