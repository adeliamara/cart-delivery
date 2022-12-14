import { AplicationError } from "./AplicationError";

export class InvalidOptionError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}