import {ExtractJwt, Strategy} from 'passport-jwt';
import {IApiConfig} from '../../IApiConfig';

export function jwtStrategy(apiConfig: IApiConfig) {

    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: apiConfig.jwtSecret,
    };

    return new Strategy(opts, (jwtPayload, done) => {
        return done(null, true);
    });

}
