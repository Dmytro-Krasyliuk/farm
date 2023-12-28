import { gardenStorageInterface } from "./interfaces/gardenStorageInterface";
import { LocalStorageInterface } from "./interfaces/lstorageInterface";
import { config } from "./config";

class LStorage {
  constructor() {
    this.getData();
  }

  getData(): LocalStorageInterface {
    let data = localStorage.getItem("data");
    if (data == null) {
      data = JSON.stringify({
        gardens: [],
        money: config.money.start,
        products: [],
      });
      localStorage.setItem("data", data);
    }

    return JSON.parse(data);
  }
}

class LStorageGarden extends LStorage {
  data: LocalStorageInterface;
  constructor() {
    super();
    this.data = this.getData();
  }

  addGarden(data: gardenStorageInterface) {
    localStorage.setItem("garden", JSON.stringify(data));
  }
  removeGarden() {}
  getGardens() {}
  updateInfo() {}
}

let lStorageGarden = new LStorageGarden();

class LStorageProducts extends LStorage {
  constructor() {
    super();
  }
}

let lStorageProducts = new LStorageProducts();

export { lStorageGarden, lStorageProducts };
