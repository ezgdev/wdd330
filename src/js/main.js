import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const dataSource = new ProductData("tents");
const productList = document.querySelector(".product-list");
const productListning = new ProductList("Tents", dataSource, productList);

productListning.init();

loadHeaderFooter();