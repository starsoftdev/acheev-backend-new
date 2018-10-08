import express from 'express';
import serverless from 'serverless-http';

import route from './routes/invite.route';

const app = express();
require('../common/config')(app);

app.use('/invite', route);

export default serverless(app);
