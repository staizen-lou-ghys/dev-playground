const express = require('express');
const cors = require('cors');
const app = express();
const port = 1000;
const placeholderTemplate = require('./emailTemplates/placeholder');
import MailService = require("@sendgrid/mail/src/mail");
const dotenv = require('dotenv')

dotenv.config();

app.use(cors({ origin: true }));

// Very simple REST api, k.i.s.s to be easier to implement on any platform
app.get('/email', (req, res) => {
  // Test with:
  // http://localhost:1000/email?mediaUrl=https://s2.q4cdn.com/175719177/files/doc_presentations/Placeholder-PDF.pdf&recipient=loughys@gmail.com
  // Or any Rest API tester like Insomnia

  // Parameters
  const { mediaUrl, recipient } = req.query;

  // Code below are options, you can change this //

  const options = {
    recipient: recipient,
    sender: {
      label: 'Test No-Reply Staizen',
      email: 'lou.ghys@staizen.com',
    },
    subject: 'Your PDF is ready!',
    html: placeholderTemplate.template(mediaUrl),
    plaintext: `Your PDF is ready at the following link: ${mediaUrl}`,
  };

  // Code below is related to sendgrid, no need to change it //

  const message = {
    to: options.recipient,
    from: `${options.sender.label} <${options.sender.email}>`,
    subject: options.subject,
    text: options.plaintext,
    html: options.html,
  };

  MailService
    .send(message)
    .then((info) => res.status(200).send(`Mail sent successfully to ${options.recipient} (${info})`))
    .catch((err) => res.status(err.responseCode).send(`Error while sending mail (${err.response})`));
});

// Uncomment if using on local machine (run server with "$ nodemon", you will need to install nodemon -g and ts-node -g)
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  MailService.setApiKey(process.env.SENDGRID_API_KEY);
});

// Uncomment if deploying to firebase
// express.widgets = functions.https.onRequest(app);
