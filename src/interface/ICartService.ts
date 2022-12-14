import Item from "../model/item.model";
import Cart from "../model/cart.model";

export interface ICartService{

    findProductsOfOpenCart(): Promise<void>;

    addItemToCart(): Promise<void>; 

    closeCart(): Promise<void>;
       
    removeItemToCart(): Promise<void>;
}