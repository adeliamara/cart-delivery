import { AplicationError } from "./AplicationError";

export class ProductNotFoundError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}