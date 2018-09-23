import express from 'express';
import serverless from 'serverless-http';

import route from './routes/auth.route';

const app = express();
require('../common/config')(app);

app.use('/auth', route);

export default serverless(app);
