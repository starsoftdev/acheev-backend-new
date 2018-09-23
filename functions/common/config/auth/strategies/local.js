import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { User } from '../../../../user/models/user.model';

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },

      async (email, password, done) => {
        try {
          let user = await User.findOne({ email: email.toLowerCase(), deleted: false });

          // authenticate by username + password combination
          if (!user) {
            user = await User.findOne({ username: email.toLowerCase(), deleted: false });
          }

          if (!user) {
            return done(null, false, { message: 'Invalid username or password' });
          }

          if (user.status === 'pending') {
            return done(null, false, {
              message: 'Your account status is currently being reviewed.'
              + ' You will receive notification when you have been approved.',
            });
          }

          if (user.status === 'suspended') {
            return done(null, false, {
              message: 'Your account has been suspended.'
              + ' Please contact the Administrator for assistance.',
            });
          }

          if (!user.authenticate(password)) {
            return done(null, false, { message: 'Invalid username or password' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
};
