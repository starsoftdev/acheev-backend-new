import passport from 'passport';
import passportJWT from 'passport-jwt';

import { User } from '../../../../user/models/user.model';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = () => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_KEY,
      },
      async (jwtPayload, cb) => {
        try {
          const user = await User.findById(jwtPayload._id);

          cb(null, user);
        } catch (err) {
          cb(err);
        }
      },
    ),
  );
};
