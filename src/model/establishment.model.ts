import Product from "./product.model";

export default class Establishment {
    private _id: string;
    private _name: string;
    private _CNPJ: string;
    private _address: string;
    private _description: string;
    private _products: Array<Product> =[];

    constructor(id: string, name: string, cnpj: string, address: string, description: string){
        this._id = id;
        this._name = name;
        this._CNPJ = cnpj;
        this._description = description;
        this._address = address;
    }

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get CNPJ(): string {
        return this._CNPJ;
    }

    public get address(): string {
        return this._address;
    }

    public get description(): string{
        return this._description;
    }

    public get products(): Array<Product>{
        return this._products;
    }

    public toString(): string {
        const resume = `    ${this.id}. ${this.name}, ${this.description}`
        return resume;
    }

    static fromJson(row: Object): Establishment {
        let [id_establishment, name_establishment, CNPJ, address, description]: any[] = Object.values(row);
        return new Establishment(id_establishment, name_establishment, CNPJ, address, description);
    }

}