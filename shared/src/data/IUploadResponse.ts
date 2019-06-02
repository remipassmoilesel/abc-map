import {IResponse} from '../http';
import {IDocument} from './IDocument';

export interface IUploadResponse extends IResponse {
    message: string;
    documents: IDocument[];
}
