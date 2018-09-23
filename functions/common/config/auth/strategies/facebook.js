import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';

import { User } from '../../../../user/models/user.model';

module.exports = () => {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'photos'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({
            provider: 'facebook',
            'providerData.id': profile.id,
            deleted: false,
          });

          if (!user) {
            const userData = {
              first_name: profile.name.givenName,
              last_name: profile.name.familyName,
              username: profile.displayName,
              email: profile.emails[0].value,
              provider: 'facebook',
              providerData: {
                id: profile.id,
                token: accessToken,
              },
            };
            if (profile.photos[0]) {
              userData.image = {
                src: profile.photos[0].value,
                alt: 'avatar',
              };
            }
 
            user = await User.create(userData);
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
};
