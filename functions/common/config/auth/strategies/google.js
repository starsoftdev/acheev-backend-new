import passport from 'passport';
import { Strategy as GoogleTokenStrategy } from 'passport-google-token';

import { User } from '../../../../user/models/user.model';

module.exports = () => {
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'photos'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({
            provider: 'google',
            'providerData.id': profile.id,
            deleted: false,
          });

          if (!user) {
            const userData = {
              first_name: profile.name.givenName,
              last_name: profile.name.familyName,
              username: profile.displayName,
              email: profile.emails[0].value,
              provider: 'google',
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
