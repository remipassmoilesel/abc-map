/**
 * All mongodb documents must implement this interface.
 *
 * Note: optional values must be of type T | null, as mongodb store undefined fields as null.
 */
export interface MongodbDocument {
  _id: string;
}
