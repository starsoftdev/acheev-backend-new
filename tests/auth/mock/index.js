const MOCK_USER = {
  first_name: 'angie',
  last_name: 'lucas',
  username: `angie.lucas${Date.now()}`,
  email: `angie.lucas${Date.now()}@gmail.com`,
  password: 'password',
  roles: ['administrator'],
  status: 'approved',
};

const NEW_PASSWORD = 'new password';

module.exports = {
  MOCK_USER,
  NEW_PASSWORD,
};
