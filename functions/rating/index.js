import express from 'express';
import serverless from 'serverless-http';

import route from './routes/rating.route';

const app = express();
require('../common/config')(app);

app.use('/rating', route);

export default serverless(app);
