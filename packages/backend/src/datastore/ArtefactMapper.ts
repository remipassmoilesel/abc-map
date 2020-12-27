import { AbcArtefact } from '@abc-map/shared-entities';
import { ArtefactDocument } from './ArtefactDocument';

export class ArtefactMapper {
  public static dtoToDoc(dto: AbcArtefact): ArtefactDocument {
    return {
      _id: dto.id,
      name: dto.name,
      path: dto.path,
      description: dto.description,
      files: dto.files,
      keywords: dto.keywords,
      license: dto.license,
      links: dto.links,
    };
  }

  public static docToDto(doc: ArtefactDocument): AbcArtefact {
    return {
      id: doc._id,
      name: doc.name,
      path: doc.path,
      description: doc.description,
      files: doc.files,
      keywords: doc.keywords,
      license: doc.license,
      links: doc.links,
    };
  }
}
