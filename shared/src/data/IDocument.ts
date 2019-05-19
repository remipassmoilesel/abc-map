import {Stream} from 'stream';

export interface IDocument {
    path: string;
    size: number;
    description: string;
    createdAt: string;
    mimeType: string;
}

export interface IDocumentStream extends IDocument {
    content: Stream;
}

export interface IDocumentBuffer extends IDocument {
    content: Buffer;
}


