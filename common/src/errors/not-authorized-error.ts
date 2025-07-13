import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;
    constructor(){
        super("User is Not Allowed to access this resource")
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors(): { message: string; field?: string; }[] {
        return [{
            message: "User is Not Allowed to access this resource"
        }]
    } 
}