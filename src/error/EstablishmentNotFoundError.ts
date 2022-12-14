import { AplicationError } from "./AplicationError";

export class EstablishmentNotFoundError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}