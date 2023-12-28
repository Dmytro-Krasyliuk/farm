import { gardenStorageInterface } from "./gardenStorageInterface"


interface IProductStorage {
    gardenId: string,
    td: number,
    time: number,
}


interface LocalStorageInterface {
  gardens: gardenStorageInterface[];
  money: number;
  products: IProductStorage[];
}

export { LocalStorageInterface };