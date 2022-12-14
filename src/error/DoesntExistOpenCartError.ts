import { AplicationError } from "./AplicationError";

export class DoesntExistOpenCartError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}