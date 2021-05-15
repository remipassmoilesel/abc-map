/*
 * FormData polyfill for k6
 * Copyright (C) 2021 Load Impact
 * License: MIT
 *
 * This simplifies the creation of multipart/form-data requests from k6 scripts.
 * It was adapted from the original version by Rob Wu[1] to remove references of
 * XMLHttpRequest and File related code which isn't supported in k6.
 *
 * [1]: https://gist.github.com/Rob--W/8b5adedd84c0d36aba64
 **/

import { FileData } from 'k6/http';

export class FormData {
  public readonly boundary: string;
  private parts: any[];

  constructor() {
    // Generate a random boundary - This must be unique with respect to the
    // form's contents.
    this.boundary = '------RWWorkerFormDataBoundary' + Math.random().toString(36);
    this.parts = [];
  }

  /**
   * Internal method. Convert input to a byte array.
   * @param inp String | ArrayBuffer | Uint8Array  Input
   */
  private __toByteArray(inp: any) {
    const arr = [];
    let i = 0,
      len;
    if (typeof inp === 'string') {
      for (len = inp.length; i < len; ++i) arr.push(inp.charCodeAt(i) & 0xff);
    } else if (inp && inp.byteLength) {
      /*If ArrayBuffer or typed array */
      if (!('byteOffset' in inp)) /* If ArrayBuffer, wrap in view */ inp = new Uint8Array(inp);
      for (len = inp.byteLength; i < len; ++i) arr.push(inp[i] & 0xff);
    }
    return arr;
  }

  /**
   * @param fieldName          String                    Form field name
   * @param data               object|string             An object or string field value.
   *
   * If data is an object, it should match the structure of k6's http.FileData
   * object (returned by http.file()) and consist of:
   * @param data.data          String|Array|ArrayBuffer  File data
   * @param data.filename      String                    Optional file name
   * @param data.content_type  String                    Optional content type, default is application/octet-stream
   **/
  public append(fieldName: string, data: FileData | string) {
    if (arguments.length < 2) {
      throw new SyntaxError('Not enough arguments');
    }
    let file: any = data;
    if (typeof data === 'string') {
      file = { data: data, content_type: 'text/plain' };
    }
    this.parts.push({ field: fieldName, file: file });
  }

  /**
   * Return the assembled request body as an ArrayBuffer.
   **/
  public body() {
    const body: any[] = [];
    const barr = this.__toByteArray('--' + this.boundary + '\r\n');
    for (let i = 0; i < this.parts.length; i++) {
      Array.prototype.push.apply(body, barr);
      const p = this.parts[i];
      let cd = 'Content-Disposition: form-data; name="' + p.field + '"';
      if (p.file.filename) {
        cd += '; filename="' + p.file.filename.replace(/"/g, '%22') + '"';
      }
      cd += '\r\nContent-Type: ' + (p.file.content_type || 'application/octet-stream') + '\r\n\r\n';
      Array.prototype.push.apply(body, this.__toByteArray(cd));
      const data = Array.isArray(p.file.data) ? p.file.data : this.__toByteArray(p.file.data);
      Array.prototype.push.apply(body, data);
      Array.prototype.push.apply(body, this.__toByteArray('\r\n'));
    }
    Array.prototype.push.apply(body, this.__toByteArray('--' + this.boundary + '--\r\n'));
    return new Uint8Array(body).buffer;
  }
}
