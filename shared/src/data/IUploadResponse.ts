import {IResponse} from '../http';
import {IDatabaseDocument} from './IDatabaseDocument';

export interface IUploadResponse extends IResponse {
    message: string;
    documents: IDatabaseDocument[];
}
