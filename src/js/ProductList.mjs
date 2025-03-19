import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `<li class="product-card">
                <a href="/product_pages/?product=${product.Id}">
                <img src="${product.Image}" alt="Image of ">
                <h2 class="card__brand">${product.Brand.Name}</h2>
                <h3 class="card__name">${product.Name}</h3>
                <p class="product-card__price">$${product.FinalPrice}</p>
                </a>
            </li>`
}

export default class ProductList {
    constructor(category, dataSource, listElement){
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    async init(){
        const myList = await this.dataSource.getData();
        this.renderList(myList);
    }
    renderList(list){
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}