import Product from "./product.model";

export class NonPerishableProduct extends Product {
    constructor(id: string, name: string, unitaryValue: number, idEstablishment: string){
        super(id,name, unitaryValue, idEstablishment);
    }

    
    static fromJson(row: Object): Product {
        let [id_product, name_product, unitaryValue, idEstablishment] : any[] = Object.values(row);
        return new NonPerishableProduct(id_product, name_product, unitaryValue, idEstablishment);
   
    }

    public toString(): string{
        let string = '';
        for (let i = 0; i < 33 - this.name.length; i++) {
            string += ' ';
        }
        
        const result = '     ' + this.id + '                        ' + this.name + string + 'R$ ' +this.unitaryValue//60
        return result;
    }
}