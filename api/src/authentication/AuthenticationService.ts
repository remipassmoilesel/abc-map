import {UserDao} from '../users/UserDao';
import {IAuthenticationRequest, IAuthenticationResult} from './IAuthenticationRequest';
import {AbstractService} from '../lib/AbstractService';
import {PasswordHelper} from './PasswordHelper';
import * as jwt from 'jsonwebtoken';
import {IApiConfig} from '../IApiConfig';
import {IUserDto} from '../users/IUserDto';
import {UserMapper} from '../users/IDbUser';
import {ITokenPayload} from './AuthenticationHelper';

export class AuthenticationService extends AbstractService {

    constructor(private userDao: UserDao, private config: IApiConfig) {
        super();
    }

    public async authenticateUser(request: IAuthenticationRequest): Promise<IAuthenticationResult> {
        const authFailed: IAuthenticationResult = {authenticated: false};
        return this.userDao.findByUsername(request.username)
            .then((user) => {
                const requestPassword = PasswordHelper.encryptPassword(request.password, user.passwordSalt);
                if (requestPassword === user.encryptedPassword) {
                    return {authenticated: true, user: UserMapper.dbToDto(user)};
                }
                return authFailed;
            })
            .catch(() => {
                return authFailed;
            });
    }

    // TODO: add better expiration time (1/2 hour) and renew tokens
    public generateToken(user: IUserDto): string {
        const tokenPayload: ITokenPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        return jwt.sign(tokenPayload, this.config.jwtSecret, {expiresIn: '1d'});
    }

}
