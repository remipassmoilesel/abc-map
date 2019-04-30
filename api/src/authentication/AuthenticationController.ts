import {AbstractController} from '../lib/server/AbstractController';
import {AuthenticationService} from './AuthenticationService';
import {ApiRoutes} from 'abcmap-shared';
import {UserService} from '../users/UserService';
import * as express from 'express';

export class AuthenticationController extends AbstractController {

    constructor(private authentication: AuthenticationService,
                private user: UserService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();
        router.post(ApiRoutes.LOGIN.path, this.login);

        return router;
    }

    public login = async (req: express.Request, res: express.Response) => {
        const {username, password} = req.body;

        const authenticationResult = await this.authentication.authenticateUser({username, password});
        if (authenticationResult.authenticated && authenticationResult.user) {
            const token = this.authentication.generateToken(authenticationResult.user);
            return res.status(200).json({
                message: 'Authorized',
                token
            });
        }
        return res.sendStatus(403);
    };

}
