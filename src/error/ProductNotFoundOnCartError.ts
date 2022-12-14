import { AplicationError } from "./AplicationError";

export class ProductNotFoundOnCartError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}