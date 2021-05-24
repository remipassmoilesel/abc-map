export class ProjectConstants {
  /**
   * Maximum size of project for uploads, in bytes
   */
  public static readonly MaxSizeBytes = 5 * 1024 * 1024;

  /**
   * Version of project, not used for the moment but will be useful for data migrations
   */
  public static readonly CurrentVersion = '0.1';

  /**
   * Name of main data file in project archive
   */
  public static readonly ManifestName = 'project.json';
}
