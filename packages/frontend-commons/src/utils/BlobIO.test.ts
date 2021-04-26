import { BlobIO } from './BlobIO';

describe('BlobIO', () => {
  it('asString()', async () => {
    const blob = new Blob(['abcdef']);
    expect(await BlobIO.asString(blob)).toEqual('abcdef');
  });

  it('asArrayBuffer()', async () => {
    const array = new Uint8Array([1, 2, 3]);
    const buffer = new Blob([array]);
    const result = new DataView(await BlobIO.asArrayBuffer(buffer));
    expect(result.getUint8(0)).toEqual(array[0]);
    expect(result.getUint8(1)).toEqual(array[1]);
    expect(result.getUint8(2)).toEqual(array[2]);
  });
});
