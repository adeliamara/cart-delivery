import { AplicationError } from "./AplicationError";

export class ProductsNotFoundError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}