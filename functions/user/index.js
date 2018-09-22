import express from 'express';
import serverless from 'serverless-http';

import route from './routes/user.route';

const app = express();
require('../common/config')(app);

app.use('/user', route);

export default serverless(app);
