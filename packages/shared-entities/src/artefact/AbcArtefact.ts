export interface AbcArtefact {
  id: string;
  name: string;
  /**
   * Relative path to the manifest file
   */
  path: string;
  description?: string;
  /**
   * Relative paths to artefact's files
   */
  files: string[];
  keywords: string[];
  /**
   * Path to the license file
   */
  license: string;
  links: string[];
}
