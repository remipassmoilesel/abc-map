import {IUserDto} from './IUserDto';

export interface IDbUser {
    id: string;
    username: string;
    email: string;
    passwordSalt: string;
    encryptedPassword: string;
}

export class UserMapper {

    public static dbToDto(db: IDbUser): IUserDto {
        return {
            id: db.id,
            username: db.username,
            email: db.email,
        };
    }

}
