import cors from 'cors';

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

module.exports = cors(corsOption);
