import { getLocalStorage ,setLocalStorage, } from "./utils.mjs";
import showAlert from "./customAlert";

function productDetailsTemplate(product) {
    return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
        class="divider"
        src="${product.Images.PrimaryLarge}"
        alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div></section>`;
}


export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }
    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails("main");
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addToCart.bind(this));
    }
    updateCartListWithQuantity(){
        const itemList = getLocalStorage("so-cart") || [];
        const found = itemList.findIndex(item => item.Id === this.productId);

        if(found < 0){
            this.product = {...this.product, quantity: 1};
            itemList.push(this.product);
            return itemList;
        }

        itemList[found].quantity += 1;
        return itemList;
    }
    addToCart() {
        // add the current product to the cart
        const itemList = this.updateCartListWithQuantity();
        setLocalStorage("so-cart", itemList);
        showAlert("Product added successfully!")
        setTimeout(()=> {
            window.location.href = `/product_listing/?category=${this.product.Category}`;
        }, 1000);
        
    }
    renderProductDetails(selector) {
        const element = document.querySelector(selector);
        element.insertAdjacentHTML(
            "afterBegin",
            productDetailsTemplate(this.product)
        );
    }
}