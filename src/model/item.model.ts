import Cart from "./cart.model";

export default class Item {

    private _id: number;
    private _quantity: number;
    private _value: number;
    private _cartId: number;
    private _idProduct: number;
    
 

    constructor(id: number, quantity: number, value: number, cart: number,  idProduct: number){
        this._id = id;
        this._idProduct = idProduct;
        this._quantity = quantity;        
        this._value = value;
        this._cartId = cart;
    }

    public get id(): number{
        return this._id;
    }

    public get idProduct(): number {
        return this._idProduct;
    }

    public get quantity(): number{
        return this._quantity;
    }

    static fromJson(row: Object): Item {
        let [id_item, quantity, value, cartID, productId] = Object.values(row);
        return new Item(id_item, quantity, value, cartID, productId);
    }

    public toString(name_product: string): void{
        let string: string = '';
        for (let i = 0; i < 25 - name_product.length; i++) {
            string += ' '
        }        
        console.log(`    ${this._idProduct}               ${name_product}` + string + `${this.quantity}                R$ ${this._value}` )
    }
    
    
}
