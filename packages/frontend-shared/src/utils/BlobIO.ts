/**
 * Event if helpers exists (e.g. Blob.text()), we use a FileReader in order to be compatible with
 * more browsers and tests environments.
 * @param blob
 */
export class BlobIO {
  public static asString(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsText(blob);
    });
  }

  public static async asArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(blob);
    });
  }

  public static async canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      const cb = (b: Blob | null) => {
        if (b) {
          resolve(b);
        } else {
          reject(new Error('Unexpected error'));
        }
      };
      canvas.toBlob(cb, 'image/png', 1);
    });
  }
}
