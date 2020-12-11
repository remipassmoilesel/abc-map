import { AbcProject } from '@abc-map/shared-entities';
import { ProjectDocument } from './ProjectDocument';

export class ProjectMapper {
  public static dtoToDoc(dto: AbcProject): ProjectDocument {
    return {
      _id: dto.metadata.id,
      metadata: dto.metadata,
      layers: dto.layers,
    };
  }

  public static docToDto(doc: ProjectDocument): AbcProject {
    return {
      metadata: doc.metadata,
      layers: doc.layers,
    };
  }
}
