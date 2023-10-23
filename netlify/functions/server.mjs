const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

let lastResponse = null;

app.post('/.netlify/functions/server/subscribe', async (req, res) => {
  console.log('Request received: ', req.body);
  const responseValue = req.body;
  
  if (JSON.stringify(responseValue) !== lastResponse) {
    lastResponse = JSON.stringify(responseValue);
    const netlifyWebhookUrl = 'https://api.netlify.com/build_hooks/653548d30c661e7c9258172d';
    try {
      await axios.post(netlifyWebhookUrl);
      console.log('Netlify build triggered: ', responseValue)
      res.status(200).send({ message: "New response received, Netlify build triggered!" });
    } catch (error) {
      console.error('Error triggering Netlify build:', error);  // Log any errors
      res.status(500).send({ error: 'Failed to trigger Netlify build.' });
    }
  } else {
    console.log('Same response received, no action taken:', responseValue);
    res.status(200).send({ message: "Same response received, no action taken." });
  }
});

module.exports.handler = serverless(app);
