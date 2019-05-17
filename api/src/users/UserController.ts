import {AbstractController} from '../lib/server/AbstractController';
import {AuthenticationService} from '../authentication/AuthenticationService';
import {ApiRoutes, ILoginResponse, IUserCreationRequest} from 'abcmap-shared';
import {UserService} from './UserService';
import * as express from 'express';
import assert from 'assert';
import {asyncHandler} from '../lib/server/asyncExpressHandler';
import {DatastoreService} from '../data/DatastoreService';
import {authenticated} from '../authentication/AuthenticationHelper';

export class UserController extends AbstractController {

    constructor(private authentication: AuthenticationService,
                private user: UserService,
                private datastore: DatastoreService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();
        router.post(ApiRoutes.REGISTER.path, asyncHandler(this.register));
        router.post(ApiRoutes.MY_PROFILE.path, authenticated(), asyncHandler(this.myProfile));

        return router;
    }

    public register = async (req: express.Request, res: express.Response): Promise<ILoginResponse> => {
        const request: IUserCreationRequest = req.body;
        assert(request.username);
        assert(request.password);
        assert(request.email);

        const user = await this.user.createUser(request);
        const token = this.authentication.generateToken(user);

        return {message: 'Registered', token, username: request.username};
    }

    public myProfile = async (req: express.Request, res: express.Response) => {
        throw new Error('Implement me');
    }

}
