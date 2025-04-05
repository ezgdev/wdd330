import { getLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.subTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.total = 0;
    this.list = [];
    this.itemTotal = 0;
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
      // Usar operador opcional y valor por defecto
      const quantity = item.quantity ?? 1;
      const price = item.FinalPrice ?? 0;
      return total + price * quantity;
    }, 0);

    // Validar si el elemento existe antes de actualizarlo
    const subtotalElement = document.querySelector(
      this.outputSelector.subtotal,
    );
    if (subtotalElement) {
      subtotalElement.innerText = this.itemTotal.toFixed(2);
    } else {
      alertMessage("Elemento #subtotal no encontrado en el DOM", true);
    }
    // Display the item subtotal in the output section (e.g., '#subtotal')
    // document.querySelector(this.outputSelector.subtotal).innerText =
    // this.itemTotal.toFixed(2);
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
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity ?? 1,
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
      zip: formData.zipdir,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: items,
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    console.log("OrderData:", orderData);

    //Send the order data to the server
    const externalServices = new ExternalServices();
    try {
      const response = await externalServices.checkout(orderData); // Submit the order
      return response;
    } catch (err) {
      alertMessage("Error when processing the order: ", true);
    }
  }
}
