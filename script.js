// Data and functionality for the AgriSmart Marketplace MVP

// List of produce items available for purchase. Each item has a name and a price per unit.
const products = [
  { name: 'Maize (90kg bag)', price: 3000 },
  { name: 'Beans (90kg bag)', price: 6000 },
  { name: 'Potatoes (50kg bag)', price: 2500 },
  { name: 'Tomatoes (crate)', price: 1500 },
  { name: 'Avocados (crate)', price: 2000 }
];

// Cart object to store selected items and their quantities
const cart = {};

/**
 * Format a number as Kenyan Shillings (KES) using standard comma separators.
 * @param {number} amount The numeric value to format.
 * @returns {string} A formatted currency string.
 */
function formatCurrency(amount) {
  return 'KES ' + amount.toLocaleString('en-KE', { minimumFractionDigits: 0 });
}

/**
 * Render the product list into the DOM. For each product, create elements
 * showing the name, price, quantity input and an "Add to cart" button.
 */
function renderProducts() {
  const listDiv = document.getElementById('product-list');
  listDiv.innerHTML = '';
  products.forEach(product => {
    // Create a wrapper div for each product
    const productDiv = document.createElement('div');
    productDiv.className = 'product';

    // Name
    const nameSpan = document.createElement('span');
    nameSpan.className = 'product-name';
    nameSpan.textContent = product.name;
    productDiv.appendChild(nameSpan);

    // Price
    const priceSpan = document.createElement('span');
    priceSpan.className = 'product-price';
    priceSpan.textContent = formatCurrency(product.price);
    productDiv.appendChild(priceSpan);

    // Quantity input
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '1';
    qtyInput.value = '1';
    qtyInput.className = 'product-qty';
    productDiv.appendChild(qtyInput);

    // Add to cart button
    const addButton = document.createElement('button');
    addButton.className = 'add-to-cart';
    addButton.textContent = 'Add to Cart';
    addButton.addEventListener('click', () => {
      const quantity = parseInt(qtyInput.value, 10);
      if (quantity > 0) {
        addToCart(product.name, product.price, quantity);
        qtyInput.value = '1';
      }
    });
    productDiv.appendChild(addButton);

    listDiv.appendChild(productDiv);
  });
}

/**
 * Add a product to the cart or update the existing quantity.
 * @param {string} name The product name.
 * @param {number} price The product price.
 * @param {number} qty Quantity to add.
 */
function addToCart(name, price, qty) {
  if (cart[name]) {
    cart[name].qty += qty;
  } else {
    cart[name] = { price: price, qty: qty };
  }
  updateCartDisplay();
}

/**
 * Update the cart summary section with current items and totals. If the cart
 * is empty, hide the cart summary and checkout form; otherwise show them.
 */
function updateCartDisplay() {
  const cartDiv = document.getElementById('cart-summary');
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalP = document.getElementById('cart-total');
  const checkoutForm = document.getElementById('checkout-form');

  const itemNames = Object.keys(cart);
  if (itemNames.length === 0) {
    cartDiv.classList.add('hidden');
    checkoutForm.classList.add('hidden');
    return;
  }

  cartDiv.classList.remove('hidden');
  checkoutForm.classList.remove('hidden');
  cartItemsDiv.innerHTML = '';

  let total = 0;
  itemNames.forEach(productName => {
    const item = cart[productName];
    const lineDiv = document.createElement('div');
    lineDiv.className = 'cart-item';
    lineDiv.innerHTML = `<span>${productName} x ${item.qty}</span><span>${formatCurrency(item.price * item.qty)}</span>`;
    cartItemsDiv.appendChild(lineDiv);
    total += item.price * item.qty;
  });
  cartTotalP.textContent = 'Total: ' + formatCurrency(total);
}

/**
 * Handle the checkout form submission. Generate an order confirmation
 * summary that includes buyer details and cart contents, then reset the cart.
 * @param {Event} event The form submit event.
 */
function handleCheckout(event) {
  event.preventDefault();
  const name = document.getElementById('buyer-name').value.trim();
  const location = document.getElementById('buyer-location').value.trim();
  const contact = document.getElementById('buyer-contact').value.trim();
  
  // Ensure buyer details are provided
  if (!name || !location || !contact) {
    alert('Please fill in all buyer details.');
    return;
  }

  // Build the order summary
  let summary = `<h3>Order Confirmation</h3>`;
  summary += `<p><strong>Buyer:</strong> ${name}<br /><strong>Location:</strong> ${location}<br /><strong>Contact:</strong> ${contact}</p>`;
  summary += '<ul>';
  let total = 0;
  Object.keys(cart).forEach(productName => {
    const item = cart[productName];
    const lineTotal = item.price * item.qty;
    summary += `<li>${productName} x ${item.qty} – ${formatCurrency(lineTotal)}</li>`;
    total += lineTotal;
  });
  summary += '</ul>';
  summary += `<p><strong>Total:</strong> ${formatCurrency(total)}</p>`;
  summary += '<p>Thank you for your order! Our logistics team will contact you soon to arrange pickup and delivery.</p>';

  // Display confirmation and reset cart
  const confirmationDiv = document.getElementById('order-confirmation');
  confirmationDiv.innerHTML = summary;
  confirmationDiv.classList.remove('hidden');

  // Clear cart and UI
  Object.keys(cart).forEach(key => delete cart[key]);
  updateCartDisplay();
  document.getElementById('checkout-form').reset();
}

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  // Attach form submit handler
  document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
});
