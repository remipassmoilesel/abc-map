import {Toaster} from "../Toaster";

export function handleRejection(error): Promise<any> {
    let msg = 'Internal error';
    if (error) {
        msg += `: ${error.message}`;
    }
    Toaster.error(msg);
    return Promise.reject(error);
}