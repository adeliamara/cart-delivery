import Establishment from "./establishment.model";
import { PerishableProduct } from "./PerishableProduct.model";
import {NonPerishableProduct} from "./NonPerishableProduct.model"

export default abstract class Product {
    private _id: string;
    private _name: string;
    private _unitaryValue: number;
    private _idEstablishment: string;

    constructor(id: string, name: string, unitaryValue: number, idEstablishment: string){
        this._id = id;
        this._name = name;
        this._unitaryValue = unitaryValue;
        this._idEstablishment = idEstablishment;
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get unitaryValue(): number {
        return this._unitaryValue;
    }

    public get idEstablishment(): string{
        return this._idEstablishment;
    }


}