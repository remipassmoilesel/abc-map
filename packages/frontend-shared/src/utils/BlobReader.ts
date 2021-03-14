/**
 * Event if helpers exists (e.g. Blob.text()), we use a FileReader in order to be compatible with
 * more browsers and tests environments.
 * @param blob
 */
export class BlobReader {
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
}
