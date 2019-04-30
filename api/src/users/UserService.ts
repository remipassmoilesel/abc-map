import {UserDao} from './UserDao';
import {IUserCreationRequest} from 'abcmap-shared/dist/users/IUserCreationRequest';
import {IDbUser, UserMapper} from './IDbUser';
import {AbstractService} from '../lib/AbstractService';
import {PasswordHelper} from './PasswordHelper';
import crypto from 'crypto';
import uuid = require('uuid');

export class UserService extends AbstractService {

    constructor(private userDao: UserDao) {
        super();
    }

    public createUser(request: IUserCreationRequest): Promise<any> {
        const passwordSalt = crypto.randomBytes(256).toString('hex');
        const encryptedPassword = PasswordHelper.encryptPassword(request.password, passwordSalt);
        const user: IDbUser = {
            id: uuid.v4(),
            username: request.username,
            email: request.email,
            passwordSalt,
            encryptedPassword
        };
        return this.userDao.insert(user)
            .then(res => UserMapper.dbToDto(user));
    }

}
