export interface ArtefactManifest {
  version: string;
  path: string;
  artefact: {
    /**
     * Readable name of the artefact
     */
    name: string;
    description?: string;
    keywords?: string[];
    /**
     * Path to the license file
     */
    license: string;
    link?: string;
    /**
     * List of files that will be downloaded
     */
    files: string[];
  };
}
