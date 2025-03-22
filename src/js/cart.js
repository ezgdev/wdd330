import {
  getLocalStorage,
  setLocalStorage,
  priceTotal,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

function deleteCartContent(event) {
  const itemId = event.target.getAttribute("data-id");
  let cartItems = getLocalStorage("so-cart");

  const itemIndex = cartItems.findIndex((item) => item.Id === itemId);
  cartItems[itemIndex].quantity -= 1;

  if (cartItems[itemIndex].quantity <= 0) {
    cartItems = cartItems.filter((item) => item.Id !== itemId);
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  const total = priceTotal(
    cartItems,
    (item) => item.FinalPrice * item.quantity,
  );
  document.querySelector(".cart-total__amount").textContent = total;
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  document.querySelectorAll(".cart-card__delete").forEach((button) => {
    button.addEventListener("click", deleteCartContent);
  });
}

function cartItemTemplate(item) {
  const newItem = `
  <li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Images.PrimaryMedium}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>  
    <span class="cart-card__delete" data-id=${item.Id}>X</span>
  </li>`;

  return newItem;
}

renderCartContents();
