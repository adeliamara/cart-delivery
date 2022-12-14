import { AplicationError } from "./AplicationError";

export class OpenCartAlreadyExists extends AplicationError {
    constructor(message: string){
        super(message)
    }
}