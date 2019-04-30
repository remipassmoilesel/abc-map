import {AbstractController} from '../server/AbstractController';
import {AuthenticationService} from './AuthenticationService';
import {ApiRoutes} from 'abcmap-shared';
import {IUserCreationRequest} from './IUserCreationRequest';
import {UserService} from './UserService';
import passport from 'passport';
import * as express from 'express';
import assert from 'assert';
import {IUserDto} from './IUserDto';

const authenticated = passport.authenticate('jwt', {session: false});

export class UserController extends AbstractController {

    constructor(private authentication: AuthenticationService,
                private user: UserService) {
        super();
    }

    public getRouter(): express.Router {
        const router = express.Router();
        router.post(ApiRoutes.REGISTER.path, this.register);
        router.post(ApiRoutes.MY_PROFILE.path, authenticated, this.myProfile);

        return router;
    }

    public register = async (req: express.Request, res: express.Response) => {
        const request: IUserCreationRequest = req.body;
        assert(request.username);
        assert(request.password);
        assert(request.email);

        const user: IUserDto = await this.user.createUser(request);
        res.send(user);
    };

    public myProfile = async (req: express.Request, res: express.Response) => {
        console.log(req.header);
    };

}