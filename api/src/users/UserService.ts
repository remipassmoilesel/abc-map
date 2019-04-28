import {UserDao} from './UserDao';
import {IUserCreationRequest} from './IUserCreationRequest';
import {IDbUser} from './IDbUser';
import {IAuthenticationRequest} from './IAuthenticationRequest';
import {AbstractService} from '../lib/AbstractService';
import crypto from 'crypto';

export class UserService extends AbstractService {

    constructor(private userDao: UserDao) {
        super();
    }

    public createUser(request: IUserCreationRequest): Promise<any> {
        const passwordSalt = crypto.randomBytes(256).toString('hex');
        const encryptedPassword = this.encryptPassword(request.password, passwordSalt);
        const user: IDbUser = {
            username: request.username,
            email: request.email,
            passwordSalt,
            encryptedPassword
        };
        return this.userDao.insert(user);
    }

    public authenticateUser(request: IAuthenticationRequest) {

    }

    private encryptPassword(password: string, salt: string) {
        return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    }
}
