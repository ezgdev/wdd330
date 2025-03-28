import { 
    getLocalStorage,
    alertMessage,
    removeAllAlerts, 
    setLocalStorage
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices()

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    let convertedJSON = {};

    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON
}

function packageItems(items) {
    const itemList = items.map((item) => ({ 
        id: item.Id, 
        name: item.Name, 
        price: item.FinalPrice, 
        quantity: item.quantity }))

    return itemList
}

export default class CheckoutProcess {
    constructor (key) {
        this.key = key;
        this.itemList = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.itemList = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        const summaryElement = document.querySelector(
            "#cartTotal"
        );
        const itemNumElement = document.querySelector(
            "#num-items"
        );
        itemNumElement.textContent = this.itemList.length;
        const amounts = this.itemList.map((item) => item.FinalPrice);
        this.itemTotal = amounts.reduce((sum, item) => sum + item);
        summaryElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateTotal() {
        this.tax = this.itemTotal * 0.06;
        this.shipping = 10 + ((this.itemList.length - 1) * 2)
        this.orderTotal = this.tax + this.shipping + this.itemTotal

        this.displayOrederTotals();
    }

    displayOrederTotals() {
        const tax = document.querySelector(`#tax`);
        const shipping = document.querySelector(`#shipping`);
        const orderTotal = document.querySelector(`#orderTotal`);

        tax.textContent = `$${this.tax.toFixed(2)}`;
        shipping.textContent = `$${this.shipping.toFixed(2)}`;
        orderTotal.textContent = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout() {
        const formData = document.forms["checkout"];

        const orderData = formDataToJSON(formData);

        orderData.orderDate = new Date();
        orderData.orderTotal = this.orderTotal;
        orderData.shipping = this.shipping;
        orderData.tax = this.tax;
        orderData.items = packageItems(this.itemList)

        
        try {
            const response = await services.checkout(orderData);
            console.log(response);
            setLocalStorage("so-cart", []);
            window.location.assign("/checkout/success.html")
        } catch (err) {
            removeAllAlerts();
            for (let message in err.message) {
                alertMessage(err.message[message]);
            }
        }

    }
}