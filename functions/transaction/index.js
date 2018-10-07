import express from 'express';
import serverless from 'serverless-http';

import route from './routes/transaction.route';

const app = express();
require('../common/config')(app);

app.use('/transaction', route);

export default serverless(app);
