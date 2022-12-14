import { AplicationError } from "./AplicationError";

export class UserDontHaveCartError extends AplicationError {
    constructor(message: string){
        super(message)
    }
}