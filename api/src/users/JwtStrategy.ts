import {ExtractJwt, Strategy} from 'passport-jwt';
import {ApiConfigHelper} from '../IApiConfig';

const apiConfig = ApiConfigHelper.load();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: apiConfig.jwtSecret
};

export const JwtStrategy = new Strategy(opts, (jwt_payload, done) => {
    return done(null, true);
});
