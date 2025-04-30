// Menu data
const menu = [
  { id: 1, name: "Garlic Grenade", description: "Explosive flavor, boom!", price: 20, image: "https://cookswithsoul.com/wp-content/uploads/2023/12/boneless-garlic-parmesan-wings-4-1024x1536.jpg" },
  { id: 2, name: "Boss Fight BBQ", description: "A smoky, sweet challenge you’ll gladly take.", price: 15, image: "https://www.spoonfulofflavor.com/wp-content/uploads/2023/06/bbq-boneless-chicken-thighs.jpg" },
  { id: 3, name: "Crimson Clash (Yangnyeom Chicken)", description: "Bold, red, and spicy-sweet — like an ultimate skill.", price: 17, image: "https://chrisseenplace.com/wp-content/uploads/2021/04/yangnyeom-chicken-plate-flatlay-731x1024.jpg" },
  { id: 4, name: "Golden Harvest (Sweetcorn Chicken)", description: "Sweet and golden, like finding treasure in-game.", price: 10, image: "https://thedefineddish.com/wp-content/uploads/2024/06/Grilled-BBQ-Chicken-Bowls-1-1025x1536.jpg" },
  { id: 5, name: "Whiskey Blaze (Jack Daniels Chicken)", description: "Bold and fiery, hits like a critical strike.", price: 15, image: "https://nyssaskitchen.com/wp-content/uploads/2022/07/BBQ-Chicken-Thighs-in-the-Oven-18-1365x2048.jpg" },
  { id: 6, name: "Cheddar Overload", description: "Max level cheese, no nerfs needed.", price: 12, image: "https://spicysouthernkitchen.com/wp-content/uploads/cheesy-chicken-19.jpg" },
  { id: 7, name: "Epic Salted Strike (Salted Egg Chicken)", description: "Rich, creamy, and powerful like a well-timed ultimate.", price: 14, image: "https://tasteofnusa.com/wp-content/uploads/2024/05/creamy-salted-egg-yolk-chicken-2.jpg" },
  { id: 8, name: "Snowstorm Surprise (Snow Cheese Chicken)", description: "Fluffy, cheesy goodness — like a snowball fight, but better.", price: 10, image: "https://amiablefoods.com/wp-content/uploads/snowy-cheese-chicken-wings-hero1a-1152x1536.jpg" },
  { id: 9, name: "Potion of Chill (Coca-Cola)", description: "Like a health potion, but an ice-cold Coca-Cola drink!", price: 3, image: "https://images.stockcake.com/public/b/a/5/ba51f1c9-d63f-47b9-a3fd-25b49672129c_large/coca-cola-pouring-moment-stockcake.jpg" }
];

let cart = [];

// Initialize the menu display
function initMenu() {
  const $menu = $("#menu-items");
  $menu.empty();

  $.each(menu, function (_, item) {
    const menuItem = $(`
      <div class="menu-item">
        <img src="${item.image}" alt="${item.name}" width="150"/>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
        <input type="number" class="qty-input" id="qty-${item.id}" min="1" value="1"/>
        <button class="add-btn" data-id="${item.id}">Add to Cart</button>
      </div>
    `);
    $menu.append(menuItem);
  });
}

// Update the cart display
function updateCart() {
  const $cart = $("#cart");
  $cart.empty();

  if (cart.length === 0) {
    $cart.html("<p>Your cart is empty.</p>");
    return;
  }

  $.each(cart, function (_, item) {
    const itemHTML = $(`
      <div class="cart-item">
        <h4>${item.name} (x${item.quantity})</h4>
        <p>Price: $${item.price.toFixed(2)} | Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-btn" data-id="${item.id}">Remove One</button>
      </div>
    `);
    $cart.append(itemHTML);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $cart.append(`<h3>Total: $${total.toFixed(2)}</h3>`);
}

// Add item to cart
function addToCart(itemId) {
  const quantity = parseInt($(`#qty-${itemId}`).val()) || 1;
  const item = menu.find(i => i.id === itemId);
  const cartItem = cart.find(c => c.id === itemId);

  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }

  updateCart();
}

// Remove one quantity of item from cart
function removeFromCart(itemId) {
  const index = cart.findIndex(c => c.id === itemId);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    updateCart();
  }
}

// Log transaction to history
function logTransaction(message, success = true) {
  const $entry = $(`
    <div class="history-entry ${success ? 'success' : 'failure'}">
      ${new Date().toLocaleString()} - ${message}
    </div>
  `);
  $("#history-entries").prepend($entry);
}

// Checkout process
function checkout() {
  const userMoney = parseFloat($("#user-money").val());
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (isNaN(userMoney)) {
    alert("Please enter your money.");
    return;
  }

  if (userMoney >= total) {
    alert("Transaction successful!");
    logTransaction(`Transaction successful. Paid $${total.toFixed(2)}, had $${userMoney.toFixed(2)}`);

    // Generate receipt
    let receiptHTML = `<p><strong>Date:</strong> ${new Date().toLocaleString()}</p>`;
    receiptHTML += `<ul>`;
    cart.forEach(item => {
      receiptHTML += `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`;
    });
    receiptHTML += `</ul>`;
    receiptHTML += `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
    receiptHTML += `<p><strong>Cash:</strong> $${userMoney.toFixed(2)}</p>`;
    receiptHTML += `<p><strong>Change:</strong> $${(userMoney - total).toFixed(2)}</p>`;

    $("#receipt-content").html(receiptHTML);
    $("#receipt").show(); // Display the receipt

    cart = [];
    updateCart();
  } else {
    alert("Insufficient funds.");
    logTransaction(`Transaction failed. Needed $${total.toFixed(2)}, had $${userMoney.toFixed(2)}`, false);
    $("#receipt").hide(); // Hide receipt on failed transaction
  }

  $("#user-money").val("");
}


// On page load
$(document).ready(function () {
  initMenu();

  // Add to cart
  $(document).on("click", ".add-btn", function () {
    const id = parseInt($(this).data("id"));
    addToCart(id);
  });

  // Remove from cart
  $(document).on("click", ".remove-btn", function () {
    const id = parseInt($(this).data("id"));
    removeFromCart(id);
  });

  // Checkout
  $("#checkout-btn").on("click", checkout);
});
