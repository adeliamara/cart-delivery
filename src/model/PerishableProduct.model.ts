import Product from "./product.model";

export class PerishableProduct extends Product {
    private _validDate: Date | null ;

    constructor(id: string, name: string, unitaryValue: number, idEstablishment: string, validDate: Date | null){
        super(id,name, unitaryValue, idEstablishment);
        this._validDate = validDate;
    }

    static fromJson(row: Object): Product {
        let [id_product, name_product, unitaryValue, idEstablishment, validDate]: any[] = Object.values(row);
        return new PerishableProduct(id_product, name_product, unitaryValue, idEstablishment, validDate);
    }

    public toString(): string{
        let string = '';
        for (let i = 0; i < 33 - this.name.length; i++) {
            string += ' ';
        }
        
        const result = '     ' + this.id + '                        ' + this.name + string + 'R$ ' + this.unitaryValue//60
        return result;
    }
    
}