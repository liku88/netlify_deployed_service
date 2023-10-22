const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

let lastResponse = null;

app.post('/.netlify/functions/server/subscribe', async (req, res) => {
  const responseValue = req.body;
  
  if (JSON.stringify(responseValue) !== lastResponse) {
    lastResponse = JSON.stringify(responseValue);
    const netlifyWebhookUrl = 'https://api.netlify.com/build_hooks/653548d30c661e7c9258172d';
    await axios.post(netlifyWebhookUrl);
    res.status(200).send({ message: "New response received, Netlify build triggered!" });
  } else {
    res.status(200).send({ message: "Same response received, no action taken." });
  }
});

module.exports.handler = serverless(app);
