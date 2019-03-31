
export enum ProjectEvent {
    PROJECT_UPDATED = 'PROJECT_UPDATED'
}

export interface IProjectEventContent {
    name: ProjectEvent;
    projectId: string;
}
