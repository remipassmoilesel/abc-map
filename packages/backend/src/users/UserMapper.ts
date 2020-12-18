import { AbcUser } from '@abc-map/shared-entities';
import { UserDocument } from './UserDocument';

export class UserMapper {
  public static dtoToDoc(dto: AbcUser): UserDocument {
    return {
      _id: dto.id,
      email: dto.email,
      password: dto.password,
      enabled: dto.enabled,
    };
  }

  public static docToDto(doc: UserDocument): AbcUser {
    return {
      id: doc._id,
      email: doc.email,
      password: doc.password,
      enabled: doc.enabled,
    };
  }
}
