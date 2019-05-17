import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import express = require('express');
import passport = require('passport');

export interface ITokenPayload {
    [k: string]: any;

    id: string;
    username: string;
    email: string;

    exp?: number;
    iat?: number;
}

export class AuthenticationHelper {

    private static AUTH_SCHEME = 'Bearer';

    public static tokenInjector() {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const payload: ITokenPayload | null = this.decodeFromHeaders(req.headers);
            if (payload) {
                _.assign(req, {abc: {token: payload}});
            }
            next();
        };
    }

    private static decodeFromHeaders(headers: any): ITokenPayload | null {
        if (headers.authorization) {
            const token = this.extractFromAuthHeader(headers.authorization);
            return jwt.decode(token) as any;
        }
        return null;
    }

    private static extractFromAuthHeader(authHeader: string): string {
        return authHeader.substring(this.AUTH_SCHEME.length).trim();
    }

    public static tokenFromRequest(req: express.Request): ITokenPayload {
        const tokenPayload: ITokenPayload | null = _.get(req, 'abc.token');
        if (!tokenPayload) {
            throw new Error('Token not found !');
        }
        return tokenPayload;
    }

    public static authenticated() {
        return passport.authenticate('jwt', {session: false});
    }

}

export const authenticated = AuthenticationHelper.authenticated;
