import { AplicationError } from "./AplicationError";

export class DatabaseError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}