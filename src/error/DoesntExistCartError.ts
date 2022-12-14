import { AplicationError } from "./AplicationError";

export class DoesntExistCartError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}