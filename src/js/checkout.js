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

  console.log("Evento ZIP activado");
  console.log("Carrito: ", checkout.list); // ¿Tiene items?

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
  .querySelector("#checkout-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    //Get the form from the event.
    const myForm = event.target;
    const zipyCode = myForm.zip.value;
    // Forzar cálculo si el ZIP es válido
    if (zipyCode.length === 5) {
      checkout.calculateOrderTotal();
    }

    // Check if the form is valid
    const isFormValid = myForm.checkValidity();
    myForm.reportValidity(); // Show validation messages
    if (!isFormValid) {
      alertMessage("Please fill in all required fields.", true);
      return;
    }

    // Check if the ZIP code is valid
    const zipCode = myForm.zip.value;
    if (zipCode.length !== 5) {
      alertMessage("Please enter a valid ZIP code.", true);
      return;
    }

    // Validate card number and expiration date manually
    const cardNumber = myForm.cardNumber.value;
    const expirationDate = myForm.expiration.value;

    const isCardNumberValid = isValidCardNumber(cardNumber);
    const isExpirationValid = isValidExpirationDate(expirationDate);

    if (!isCardNumberValid) {
      alertMessage("Invalid Card Number", true);
      return;
    }

    if (!isExpirationValid) {
      alertMessage("Invalid Expiration Date", true);
      return;
    }

    // Show validation messages
    try {
      await checkout.checkout(myForm);
      //localStorage.removeItem("so-cart");
      window.location.href = "/success.html";
    } catch (error) {
      alertMessage("Error when processing the order: " + error.message, true);
    }
  });

function isValidCardNumber(cardNumber) {
  // Card number validation logic (let 13-19 digits)
  return /^\d{13,19}$/.test(cardNumber.replace(/\s/g, "")); // Eliminar espacios
}

// validate expiration date (MM/YY) year must be current or future year
function isValidExpirationDate(expirationDate) {
  if (!/^\d{2}\/\d{2}$/.test(expirationDate)) return false; // Validar formato MM/YY
  const [month, year] = expirationDate.split("/");
  const expYear = parseInt("20" + year);
  const expMonth = parseInt(month) - 1; // Mes en JS es 0-indexado
  const expDate = new Date(expYear, expMonth + 1, 0); // Último día del mes
  return expDate > new Date();
}

/*function isValidExpirationDate(expirationDate) {
  const [month, year] = expirationDate.split("/");
  const expDate = new Date(`20${year}-${month}-01`);
  return expDate > new Date();
}*/

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
