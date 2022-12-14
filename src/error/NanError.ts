import { AplicationError } from "./AplicationError";

export class NanError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}