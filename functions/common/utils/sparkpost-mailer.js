import axios from 'axios';
import fs from 'fs';
import handlebars from 'handlebars';

const SPARKPOST_API = 'https://api.sparkpost.com/api/v1/transmissions';
const TEMPLATE_PATH = './functions/common/templates/email/';

/**
 * recipients: [{"address": "F. Scott <developers+curl@sparkpost.com>"}]
 */
export default async ({
  to,
  from,
  subject,
  template,
  context,
}) => {
  try {
    const mailTemplate = fs.readFileSync(`${TEMPLATE_PATH}${template}.html`, 'utf8');
    const compileTemplate = handlebars.compile(mailTemplate);
    const mailContent = compileTemplate(context);

    const res = await axios.post(
      SPARKPOST_API,
      {
        content: {
          from,
          subject,
          text: mailContent,
          recipients: [
            { address: to },
          ],
        },
      },
      {
        headers: {
          Authorization: process.env.SPARKPOST_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    );

    return res;
  } catch (err) {} // eslint-disable-line no-empty
};
