import express from 'express';
import serverless from 'serverless-http';

import route from './routes/offer.route';

const app = express();
require('../common/config')(app);

app.use('/offer', route);

export default serverless(app);
