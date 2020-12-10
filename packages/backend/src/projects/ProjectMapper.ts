import { AbcLayer, AbcProject } from '@abc-map/shared-entities';
import { ProjectDocument, ProjectLayer } from './ProjectDocument';
import { ObjectID } from 'mongodb';

export class ProjectMapper {
  public static dtoToDoc(dto: AbcProject): ProjectDocument {
    return {
      _id: new ObjectID(dto.id),
      name: dto.name,
      projection: {
        ...dto.projection,
      },
      layers: dto.layers.map((lay) => LayerMapper.dtoToDoc(lay)),
    };
  }

  public static docToDto(doc: ProjectDocument): AbcProject {
    return {
      id: doc._id?.toHexString() || '',
      name: doc.name,
      projection: {
        ...doc.projection,
      },
      layers: doc.layers.map((lay) => LayerMapper.docToDto(lay)),
    };
  }
}

export class LayerMapper {
  public static dtoToDoc(dto: AbcLayer): ProjectLayer {
    return {
      ...dto,
      metadata: {
        ...dto.metadata,
      },
    };
  }

  public static docToDto(doc: ProjectLayer): AbcLayer {
    return {
      ...doc,
      metadata: {
        ...doc.metadata,
      },
    };
  }
}
