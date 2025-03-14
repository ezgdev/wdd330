import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);
product.init();

/*********** Original Code ************/
// import { getLocalStorage, setLocalStorage } from "./utils.mjs";
/*function addProductToCart(product) {
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
  .addEventListener("click", addToCartHandler);*/
