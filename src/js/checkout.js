import { loadHeaderFooter } from "./utils.mjs";

import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart");
order.init();

document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateTotal.bind(order));

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  order.checkout();
});
