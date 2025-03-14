import { setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
    return `<section class="product-detail">
    <h3>${product.Brandname}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Image}" alt="${product.NameWithoutBrand}" />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
}

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.dataSource = dataSource;
        this.product = {};
    }
    async init() {
        // use our datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // render the product details to the page once we have the data
        this.renderProductDetails("main");
        // now we can add a listener to the Add to Cart button
        document.getElementById("addToCart").addEventListener("click", this.addToCart.bind(this));
    }

    addToCart() {
        // add the current product to the cart
        setLocalStorage("so-cart", this.product);
    }

    renderProductDetails(selector) {
        const element = document.querySelector(selector);
        element.insertAdjacentHTML(
            "afterbegin",
            productDetailsTemplate(this.product)
        );
    }
}


/* function addProductToCart(product) {
  const itemList = getLocalStorage("so-cart") || [];
  itemList.push(product);
  setLocalStorage("so-cart", itemList);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
 */