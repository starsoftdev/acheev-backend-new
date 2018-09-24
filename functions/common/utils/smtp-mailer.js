import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import { stubTransport } from 'nodemailer-stub';

let stmpTransport;
if (process.env.MAILER_SERVICE_PROVIDER && process.env.MAILER_SERVICE_PROVIDER !== '') {
  stmpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER,
    auth: {
      user: process.env.MAILER_EMAIL_ID,
      pass: process.env.MAILER_PASSWORD,
    },
    secureConnection: false,
  });
} else {
  // for testing purposes
  stmpTransport = nodemailer.createTransport(stubTransport);
}

// set template compiler
const handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: './functions/common/templates/email/',
  extName: '.html',
};
stmpTransport.use('compile', hbs(handlebarsOptions));

export default stmpTransport;
