import { v4 } from "uuid";

import "./style.scss";
import { products } from "./data/products";
import { users } from "./data/users";
import { createGarden } from "./garden";
import { lStorageGarden, lStorageProducts } from "./lstorage";
import { gardenStorageInterface } from "./interfaces/gardenStorageInterface";
import { config } from "./config";
import { IGardenLast } from "./interfaces/gardenLastInterface";
import { IProduct } from "./interfaces/productInterface";

let game = document.querySelector(".game") as HTMLDivElement;
let selectedProduct : IProduct | null =   {
    title: "Морква",
    price: 40,
    image: "carrot.png",
    time: 150,
    profit: 85,
  }

function showStartGame() {
  showStartGarden();
  showStartBalance();
}

function showStartGarden() {
  let gardens = lStorageGarden.getData().gardens;
  gardens.forEach((garden) => {
    let newGarden = document.createElement("div");
   
    newGarden.classList.add("garden");
    newGarden.style.width = garden.w + "px";
    newGarden.style.height = garden.h + "px";
    newGarden.style.top = garden.y + "px";
    newGarden.style.left = garden.x + "px";
    newGarden.dataset.id = garden.id;
    game.append(newGarden);
     createPlaceProducts(newGarden);
  });
}

function showStartBalance() {}

showStartGame();
function createPlaceProducts(garden : HTMLDivElement) {
  let paddingGarden = 10;
  let gapGarden = 5;
  let widthProduct = 30;
  let heightProduct = 30;

  let widthGarden =
    parseInt(getComputedStyle(garden).width) - paddingGarden * 2;
  let heightGarden =
    parseInt(getComputedStyle(garden).height) - paddingGarden * 2;

  let elInRow = Math.floor(
    (widthGarden + gapGarden) / (widthProduct + gapGarden)
  );
  let elInCol = Math.floor(
    (heightGarden + gapGarden) / (heightProduct + gapGarden)
  );

  // Врахування останнього проміжку в ряду та колонці
  if (widthGarden % (widthProduct + gapGarden) === 0) {
    elInRow -= 1;
  }
  if (heightGarden % (heightProduct + gapGarden) === 0) {
    elInCol -= 1;
  }

  let amountProducts = elInRow * elInCol;

  for (let i = 0; i < amountProducts; i++) {
    let placeProduct = document.createElement("div");
    placeProduct.classList.add("garden-place__product");
    placeProduct.classList.add("empty");
    garden.append(placeProduct);
  }
}

let waitCreatedGarden = false;
let processCreatedGarden = false;

let createGardenBtn = document.querySelector(
  ".createGardenBtn"
) as HTMLButtonElement;

createGardenBtn.addEventListener("click", function () {
  waitCreatedGarden = true;
});

game.addEventListener("mousedown", function (e) {
  if (waitCreatedGarden && e.target == game) {
    createGarden(0, 0, e.clientX, e.clientY);
    processCreatedGarden = true;
    waitCreatedGarden = false;
  }
});

game.addEventListener("mousemove", function (e) {
  if (processCreatedGarden) {
    let amountGarden = document.querySelectorAll(".garden").length;
    let lastGarden = document.querySelectorAll(".garden")[
      amountGarden - 1
    ] as HTMLDivElement;
    let leftGarden = getComputedStyle(lastGarden).left;
    let topGarden = getComputedStyle(lastGarden).top;
    let wGarden = e.clientX - parseInt(leftGarden);
    let hGarden = e.clientY - parseInt(topGarden);

    lastGarden.style.width = wGarden - 20 + "px";
    lastGarden.style.height = hGarden - 20 + "px";

    checkGarden();
  }
});

game.addEventListener("mouseup", function (e) {
  if (processCreatedGarden) {
    waitCreatedGarden = false;
    processCreatedGarden = false;

    if (checkGarden()) {
      confirmCreateGarden();
    } else {
      rejectCreateGarden();
    }
  }
});

function confirmCreateGarden() {
  let { w, h, x, y, lastGarden } = getDataLastGarden();
  // getPriceGarden(wLastGarden, hLastGarden);
  let idGarden: string = v4();
  lastGarden.dataset.idGarden = idGarden;
  let data: gardenStorageInterface = {
    w,
    h,
    x,
    y,
    id: idGarden,
  };
  lStorageGarden.addGarden(data);
  createPlaceProducts(lastGarden);
}

function rejectCreateGarden() {
  let { lastGarden } = getDataLastGarden();
  lastGarden.remove();
}

function checkGarden(): boolean {
  let { w, h, lastGarden } = getDataLastGarden();

  let allGarden = document.querySelectorAll(".garden");
  let countError = 0;

  for (let i = 0; i < allGarden.length - 1; i++) {
    let garden = lastGarden.getBoundingClientRect();
    let currentGarden = allGarden[i].getBoundingClientRect();

    let result =
      garden.top - 20 < currentGarden.bottom &&
      garden.bottom + 20 > currentGarden.top &&
      garden.left - 20 < currentGarden.right &&
      garden.right + 20 > currentGarden.left;

    if (result) {
      console.log("error");
      countError++;
    }
  }

  if (countError > 0 || w < config.garden.minW || h < config.garden.minH) {
    markInvalidGarden(lastGarden);
  } else {
    markValidGarden(lastGarden);
  }

  return (
    !lastGarden.classList.contains("error") &&
    countError == 0 &&
    w > config.garden.minW &&
    h > config.garden.minH
  );
}

function markInvalidGarden(lastGarden: HTMLDivElement) {
  lastGarden.classList.add("error");
}
function markValidGarden(lastGarden: HTMLDivElement) {
  lastGarden.classList.remove("error");
}

function getDataLastGarden(): IGardenLast {
  let amountGarden = document.querySelectorAll(".garden").length;
  let lastGarden = document.querySelectorAll(".garden")[
    amountGarden - 1
  ] as HTMLDivElement;
  let wLastGarden = parseInt(getComputedStyle(lastGarden).width);
  let hLastGarden = parseInt(getComputedStyle(lastGarden).height);
  let xLastGarden = parseInt(getComputedStyle(lastGarden).left);
  let yLastGarden = parseInt(getComputedStyle(lastGarden).top);
  return {
    w: wLastGarden,
    h: hLastGarden,
    x: xLastGarden,
    y: yLastGarden,
    lastGarden: lastGarden,
  };
}

function getPriceGarden(wLastGarden: number, hLastGarden: number) {
  let s = wLastGarden * hLastGarden;
  let priceGarden = Math.round(s * 0.5);
  alert(priceGarden);
}



let gardenPlaceProduct = document.querySelectorAll('.garden-place__product')


function handlerHoverProduct(el: HTMLDivElement) {
  if (selectedProduct != null) {
    if (el.classList.contains("empty")) {
      el.style.backgroundImage = `url(../img/${selectedProduct.image})`;
      el.style.backgroundSize = "contain";
      el.style.backgroundPosition = "center";
      el.style.backgroundRepeat = "no-repeat";
      el.classList.add("process");


    }
    if (el.classList.contains("process")) {
            setTimeout(() => {
              if (el.classList.contains("process")) {
                el.classList.add("ready");
              }
            }, selectedProduct.time*1000);
    }

    if (el.classList.contains("ready")) {
      el.classList.remove("ready");
      el.classList.remove("process");
      el.style.backgroundImage = "";
      el.classList.add("empty");
    }
  }
}

for (let i = 0; i < gardenPlaceProduct.length; i++) {
  let el = gardenPlaceProduct[i] as HTMLDivElement;
  el.addEventListener("mouseover", () => { handlerHoverProduct(el) });
}
