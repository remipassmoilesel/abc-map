import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { ProjectDocument } from './ProjectDocument';

export class ProjectMapper {
  public static dtoToDoc(dto: AbcProjectMetadata, userId: string): ProjectDocument {
    return {
      _id: dto.id,
      userId,
      name: dto.name,
      projection: {
        name: dto.projection.name,
      },
      version: dto.version,
      containsCredentials: dto.containsCredentials,
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
      containsCredentials: doc.containsCredentials,
    };
  }
}
