import {IResponse} from '../http';

export interface IUploadResponse extends IResponse {
    message: string;
    path: string;
}
