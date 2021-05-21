export interface ProjectSaveResponse {
  status: ProjectSaveStatus;
  projectsLeft: number;
}

export enum ProjectSaveStatus {
  Saved = 'Saved',
  LimitReached = 'LimitReached',
}
