import {UserDao} from './UserDao';
import {IAuthenticationRequest} from './IAuthenticationRequest';
import {AbstractService} from '../lib/AbstractService';
import {PasswordHelper} from './PasswordHelper';
import * as jwt from 'jsonwebtoken';
import {IApiConfig} from '../IApiConfig';

export class AuthenticationService extends AbstractService {

    constructor(private userDao: UserDao, private config: IApiConfig) {
        super();
    }

    public async authenticateUser(request: IAuthenticationRequest): Promise<boolean> {
        const user = await this.userDao.findByUsername(request.username);
        const requestPassword = PasswordHelper.encryptPassword(request.password, user.passwordSalt);
        return requestPassword === user.encryptedPassword;
    }

    public async generateToken(username: string) {
        const user = await this.userDao.findByUsername(username);
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);

        return jwt.sign({
            id: user.id,
            email: user.email,
            exp: Math.round(expirationDate.getTime() / 1000),
        }, this.config.jwtSecret);
    }

}
