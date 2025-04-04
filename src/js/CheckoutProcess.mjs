import {
  getLocalStorage,
  setLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "./utils.mjs";

import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  // Initialize the checkout process by loading the cart and calculating the item total
  init() {
    this.list = getLocalStorage(this.key) ?? []; // Load the cart items from localStorage
    this.calculateItemSummary(); // Calculate and display the subtotal on page load
  }

  // Calculate and display the item subtotal
  calculateItemSummary() {
    this.itemTotal = this.list.reduce((total, item) => {
      const quantity = item.Result.Quantity || 1;
      return total + item.Result.FinalPrice * quantity; // Sum the total price of items in the cart
    }, 0);

    // Display the item subtotal in the output section (e.g., '#subtotal')
    document.querySelector(this.outputSelector.subtotal).innerText =
      this.itemTotal.toFixed(2);
  }

  // Calculate shipping, tax, and total, and display them after ZIP code is entered
  calculateOrderTotal() {
    if (this.list.length === 0) {
      alertMessage("El carrito está vacío", true);
      return;
    }
    this.shipping = 10 + (this.list.length - 1) * 2; // $10 for the first item, $2 for each additional item
    this.tax = this.itemTotal * 0.06; // 6% sales tax

    // Calculate the final order total
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    // Display the calculated totals
    this.displayOrderTotals();
  }

  // Display the calculated order totals (subtotal, shipping, tax, total)
  displayOrderTotals() {
    document.querySelector(this.outputSelector.shipping).innerText =
      this.shipping.toFixed(2);
    document.querySelector(this.outputSelector.tax).innerText =
      this.tax.toFixed(2);
    document.querySelector(this.outputSelector.total).innerText =
      this.orderTotal.toFixed(2);
  }

  // Convert the form data into an order object
  formDataToJSON(formElement) {
    const formData = new FormData(formElement),
      convertedJSON = {};

    formData.forEach(function (value, key) {
      convertedJSON[key] = value;
    });

    return convertedJSON;
  }

  // Prepare the items part of the order data
  packageItems(items) {
    return items.map((item) => ({
      id: item.Result.Id, // Product ID
      name: item.Result.Name, // Product name
      price: item.Result.FinalPrice, // Product price
      quantity: item.Result.Quantity || 1, // Quantity (default to 1 if not available)
    }));
  }

  // Handle the checkout process (submit the order)
  async checkout(form) {
    const formData = this.formDataToJSON(form); // Convert form data to JSON

    // Prepare the items list
    const items = this.packageItems(this.list);

    // Build the complete order data object
    const orderData = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: items,
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    //console.log("OrderData:", orderData);

    //Send the order data to the server
    const externalServices = new ExternalServices();
    try {
      const response = await externalServices.checkout(orderData); // Submit the order
      setLocalStorage("so-cart", []); // Clear the cart in localStorage
      removeAllAlerts(); // Remove any existing alerts
      //location.assign("/checkout/success.html");
      return response;
    } catch (err) {
      removeAllAlerts();
      for (let message in err.message) {
        alertMessage(err.message[message]);
      }
    }
  }
}

/*
const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  let convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  const itemList = items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity,
  }));

  return itemList;
}

export default class CheckoutProcess {
  constructor(key) {
    this.key = key;
    this.itemList = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.itemList = getLocalStorage(this.key) ?? []; //?? []
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector("#cartTotal");
    const itemNumElement = document.querySelector("#num-items");
    itemNumElement.textContent = this.itemList.length;
    const amounts = this.itemList.map((item) => item.FinalPrice);
    this.itemTotal = amounts.reduce((sum, item) => sum + item);
    summaryElement.textContent = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (this.itemList.length - 1) * 2;
    this.orderTotal =
      parseFloat(this.itemTotal) +
      parseFloat(this.shipping) +
      parseFloat(this.tax);
    this.displayOrederTotals();
  }

  displayOrederTotals() {
    const tax = document.querySelector("#tax");
    const shipping = document.querySelector("#shipping");
    const orderTotal = document.querySelector("#orderTotal");

    tax.textContent = `$${this.tax.toFixed(2)}`;
    shipping.textContent = `$${this.shipping.toFixed(2)}`;
    orderTotal.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout() {
    const formData = document.forms["checkout"];
    const orderData = formDataToJSON(formData);
    orderData.orderDate = new Date().toISOString();
    orderData.orderTotal = this.orderTotal;
    orderData.shipping = this.shipping;
    orderData.tax = this.tax;
    orderData.items = packageItems(this.itemList);
    try {
      const response = await services.checkout(orderData);
      console.log(response);
      setLocalStorage("so-cart", []);
      location.assign("/checkout/success.html");
    } catch (err) {
      removeAllAlerts();
      for (let message in err.message) {
        alertMessage(err.message[message]);
      }
      console.log(err);
    }
  }
}
*/
