import {AbstractController} from '../lib/server/AbstractController';
import {AuthenticationService} from './AuthenticationService';
import {ApiRoutes, ILoginResponse} from 'abcmap-shared';
import * as express from 'express';
import {asyncHandler} from '../lib/server/asyncExpressHandler';

export class AuthenticationController extends AbstractController {

    constructor(private authentication: AuthenticationService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();
        router.post(ApiRoutes.LOGIN.path, asyncHandler(this.login));

        return router;
    }

    public login = async (req: express.Request, res: express.Response): Promise<ILoginResponse> => {
        const {username, password} = req.body;

        const authenticationResult = await this.authentication.authenticateUser({username, password});
        if (authenticationResult.authenticated && authenticationResult.user) {
            const token = this.authentication.generateToken(authenticationResult.user);
            return {message: 'Authorized', token};
        }

        return Promise.reject(new Error('Forbidden'));
    };

}
