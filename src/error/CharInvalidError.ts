import { AplicationError } from "./AplicationError";

export class CharInvalidError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}