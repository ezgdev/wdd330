import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

const dataSource = new ProductData();

const productList = document.querySelector(".product-list");
const productListning = new ProductList(category, dataSource, productList);

productListning.init();


