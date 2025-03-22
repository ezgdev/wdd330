// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Query get url param
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);

  return product;
}

// Render a list of templates
export function renderListWithTemplate(
  templateFunction,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  const listElements = list.map(templateFunction);

  // if clear is true clear DOM
  clear && (parentElement.innerHtml = "");

  parentElement.insertAdjacentHTML(position, listElements.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  callback && callback(data);
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  cartCount();
}

export function priceTotal(itemsList, getPrice) {
  let total = 0;
  itemsList.forEach((item) => total += getPrice(item));

  return `$ ${total}`;
}

export function cartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCounter = document.getElementById("cartCount");
  if (cartItems.length != 0) {
    cartCounter.innerHTML = cartItems.length;
    cartCounter.classList.remove("hidden");
  } else {
    cartCounter.classList.add("hidden");
  }
}
