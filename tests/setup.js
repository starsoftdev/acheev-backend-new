import mongoose from 'mongoose';
import yenv from 'yenv';

// load env.yml
global.ENV = yenv('env.yml', { env: 'test' });

beforeAll((done) => {
  if (mongoose.connection.readyState !== 1) {
    mongoose
      .connect(global.ENV.MONGO_URI, { useNewUrlParser: true })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  } else {
    done();
  }
});

afterAll((done) => {
  mongoose.disconnect();
  done();
});
