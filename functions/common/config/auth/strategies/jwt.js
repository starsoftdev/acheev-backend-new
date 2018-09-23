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
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload._id);

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
};
