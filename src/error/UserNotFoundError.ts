import { AplicationError } from "./AplicationError";

export class UserNotFoundError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}