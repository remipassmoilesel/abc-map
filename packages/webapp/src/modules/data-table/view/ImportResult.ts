export interface ImportResult {
  file: File | undefined;
  skipped: number;
  skippedIds: string[];
  imported: number;
  error: unknown;
}
