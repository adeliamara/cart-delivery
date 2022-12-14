import { AplicationError } from "./AplicationError";

export class ProductInvalidError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}