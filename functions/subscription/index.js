import express from 'express';
import serverless from 'serverless-http';

import route from './routes/subscription.route';

const app = express();
require('../common/config')(app);

app.use('/subscription', route);

export default serverless(app);
