import express from 'express';
import serverless from 'serverless-http';

import route from './routes/message.route';

const app = express();
require('../common/config')(app);

app.use('/message', route);

export default serverless(app);
