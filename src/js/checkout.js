import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

// Initialize the CheckoutProcess with key 'so-cart' and output selectors
const checkout = new CheckoutProcess("so-cart", {
  subtotal: "#subtotal",
  shipping: "#shipping",
  tax: "#tax",
  total: "#total",
});

checkout.init(); // Initialize the process to calculate the item subtotal

// Add an event listener for ZIP code input to trigger the order total calculation
document.querySelector("#zip").addEventListener("input", (event) => {
  const zipCode = event.target.value;

  // If ZIP code has 5 digits, calculate shipping, tax, and total
  if (zipCode.length === 5) {
    checkout.calculateOrderTotal();
  } else if (zipCode === "") {
    document.querySelector(checkout.outputSelector.shipping).innerText = "0.00";
    document.querySelector(checkout.outputSelector.tax).innerText = "0.00";
    document.querySelector(checkout.outputSelector.total).innerText = "0.00";
  }
});

// Handle form submission for checkout
document
  .querySelector("#checkoutSubmit")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    //Get the form element
    const myForm = document.forms["checkout"];
    // Check if the form is valid
    const formIsValid = myForm.checkValidity();

    // Validate card number and expiration date manually
    const cardNumber = myForm["cardNumber"].value;
    const expirationDate = myForm["expiration"].value;

    const isCardNumberValid = isValidCardNumber(cardNumber);
    const isExpirationValid = isValidExpirationDate(expirationDate);

    if (!isCardNumberValid) {
      alertMessage("Invalid Card Number", true);
    }

    if (!isExpirationValid) {
      alertMessage("Invalid Expiration Date", true);
    }

    if (formIsValid && isCardNumberValid && isExpirationValid) {
      try {
        await checkout.checkout(myForm);
        localStorage.removeItem("so-cart");
        window.location.href = "/checkout/success.html";
      } catch (error) {
        throw new Error("Order failed", error);
      }
    }
  });

function isValidCardNumber(cardNumber) {
  // Card number validation logic (e.g., Luhn algorithm)
  return /^[0-9]{16}$/.test(cardNumber);
}

// validate expiration date (MM/YY) year must be current or future year
function isValidExpirationDate(expirationDate) {
  const [month, year] = expirationDate.split("/");
  const expDate = new Date(`20${year}-${month}-01`);
  return expDate > new Date();
}

/*
const order = new CheckoutProcess("so-cart");
order.init();

document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateTotal.bind(order));

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.forms[0];
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) {
    order.checkout();
  }
});
*/
