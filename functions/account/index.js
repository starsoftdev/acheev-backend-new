import express from 'express';
import passport from 'passport';
import serverless from 'serverless-http';

import route from './routes/account.route';

const app = express();
require('../common/config')(app);

app.use('/account', passport.authenticate('jwt', { session: false }), route);

export default serverless(app);
