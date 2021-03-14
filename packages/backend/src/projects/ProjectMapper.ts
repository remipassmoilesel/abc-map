import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { ProjectDocument } from './ProjectDocument';

export class ProjectMapper {
  public static dtoToDoc(dto: AbcProjectMetadata, userId: string): ProjectDocument {
    return {
      _id: dto.id,
      name: dto.name,
      projection: {
        name: dto.projection.name,
      },
      version: dto.version,
      userId,
    };
  }

  public static docToDto(doc: ProjectDocument): AbcProjectMetadata {
    return {
      id: doc._id,
      name: doc.name,
      projection: {
        name: doc.projection.name,
      },
      version: doc.version,
    };
  }
}
