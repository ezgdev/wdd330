import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

const category = getParam("category");
const dataSource = new ProductData("category");
const productList = document.querySelector(".product-list");
const productListning = new ProductList(category, dataSource, productList);

productListning.init();

loadHeaderFooter();
