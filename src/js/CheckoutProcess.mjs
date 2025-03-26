import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
    constructor (key, outpuSelector) {
        this.key = key;
        this.outpuSelector = outpuSelector;
        this.itemList = [];
        this.subTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.itemList = getLocalStorage(this.key);
        this.calculateSubtotal();
        this.calculateTotal();
        this.displayOrederTotals()
    }

    calculateSubtotal() {
        this.itemList.map((item) => this.subTotal += item.FinalPrice * item.quantity)
    }

    calculateTotal() {
        this.tax = this.subTotal * 0.06;
        this.shipping = 10 + ((this.itemList.length - 1) * 2)
        this.orderTotal = this.subTotal + this.shipping + this.orderTotal
    }

    displayOrederTotals() {
        const subTotal = document.querySelector(`.${this.outpuSelector}__subtotal`);
        const tax = document.querySelector(`.${this.outpuSelector}__tax`);
        const shipping = document.querySelector(`.${this.outpuSelector}__shipping`);
        const orderTotal = document.querySelector(`.${this.outpuSelector}__total`);

        subTotal.textContent = `$${this.subTotal.toFixed(2)}`;
        tax.textContent = `$${this.tax.toFixed(2)}`;
        shipping.textContent = `$${this.shipping.toFixed(2)}`;
        orderTotal.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
}