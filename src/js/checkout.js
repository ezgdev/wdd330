import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart");
order.init();

document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateTotal.bind(order));

document.querySelector("#checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const myForm = document.forms[0];
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) {
    order.checkout(myForm);
  }
});
