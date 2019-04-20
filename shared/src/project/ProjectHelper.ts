import * as uuid from 'uuid';

export class ProjectHelper {

    public static generateProjectId(): string {
        return `project-${uuid.v4()}`.toLocaleLowerCase();
    }

}
