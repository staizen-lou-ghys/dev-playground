const express = require('express');
const cors = require('cors');
const app = express();
const port = 1000;
const nodemailer = require('nodemailer');
const placeholderTemplate = require('./emailTemplates/placeholder');

app.use(cors({ origin: true }));

app.get('/email', (req, res) => {
  // Test with:
  // http://localhost:1000/email?mediaUrl=https://s2.q4cdn.com/175719177/files/doc_presentations/Placeholder-PDF.pdf&mediaName=PlaceholderPDF

  // Parameters
  const { mediaUrl, mediaName } = req.query;

  // Code below are options, you can change this //

  const mailServer = {
    host: 'smtp.office365.com',
    port: 587,
    ssl: false,
    user: {
      label: 'Test No-Reply Staizen',
      email: 'lou.ghys@staizen.com',
      password: '!Helix404',
    },
  };

  const messageOptions = {
    subject: 'Your PDF is ready!',
    recipient: 'lou.ghys@staizen.com',
    media: {
      useAttachment: true,
      url: mediaUrl,
      label: mediaName ?? 'attachment',
    },
    html: placeholderTemplate.template(mediaUrl),
    plaintext: `Your PDF is ready at the following link: ${mediaUrl}`,
  };

  // Code below is related to nodemailer, no need to change it //

  const mailTransport = nodemailer.createTransport({
    host: mailServer.host,
    port: mailServer.port,
    secure: mailServer.ssl,
    auth: {
      user: mailServer.user.email,
      pass: mailServer.user.password,
    },
  });

  const message = {
    from: `${mailServer.user.label} <${mailServer.user.email}>`,
    to: messageOptions.recipient,
    subject: messageOptions.subject,
    text: messageOptions.plaintext,
    html: messageOptions.html,
    ...(messageOptions.media.useAttachment
      ? {
          attachments: [{ filename: messageOptions.media.label, path: messageOptions.media.url }],
        }
      : {}),
  };

  mailTransport
    .sendMail(message)
    .then((info) => res.status(200).send(`Mail (${info.messageSize} bytes) sent successfully in ${info.messageTime}ms!`))
    .catch((err) => res.status(err.responseCode).send(`Error while sending mail (${err.response})`));
});

// Uncomment if using on local machine (run server with "$ node server.js" or "$ nodemon server.js")
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Uncomment if deploying to firebase
// express.widgets = functions.https.onRequest(app);
