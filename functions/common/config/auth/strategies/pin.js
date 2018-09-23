import passport from 'passport';
import { Strategy as PinStrategy } from 'passport-pin';

import { User } from '../../../../user/models/user.model';

module.exports = () => {
  passport.use(
    new PinStrategy(
      async (pin, done) => {
        try {
          if (!pin || pin === '') {
            return done(null, false, { message: 'Invalid pincode' });
          }

          const user = await User.findOne({ pin, deleted: false });

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

          if (!user) {
            return done(null, false, { message: 'Invalid pincode' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
};
