import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

const dataSource = new ProductData();

const productList = document.querySelector(".product-list");
const productListning = new ProductList(category, dataSource, productList);

document.querySelector("#current-category").textContent = category;
const productCount = await dataSource.getData(category).then(data => data.length);
document.querySelector("#product-count").textContent = `(${productCount} items)`;

productListning.init();
