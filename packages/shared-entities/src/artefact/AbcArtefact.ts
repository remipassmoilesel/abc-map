export interface AbcArtefact {
  id: string;
  name: string;
  description?: string;
  /**
   * Keywords used for search and filter
   */
  keywords: string[];
  /**
   * Path to the license file
   */
  license: string;
  /**
   * Link to the source of data
   */
  link?: string;
  /**
   * Path to the manifest file relative to the datastore
   */
  path: string;
  /**
   * Paths to artefact's files relative to the manifest
   */
  files: string[];
}
