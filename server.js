const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

let lastResponse = null;

app.post('/subscribe', async (req, res) => {
    const responseValue = req.body;  // The response from Azure Web PubSub will be in the request body
   
    if (JSON.stringify(responseValue) !== lastResponse) {
        lastResponse = JSON.stringify(responseValue);
        // Trigger Netlify build
        const netlifyWebhookUrl = 'https://api.netlify.com/build_hooks/65352a2134f6566c1306db97';
        await axios.post(netlifyWebhookUrl);
       
        res.status(200).send({ message: "New response received, Netlify build triggered!" });
    } else {
        res.status(200).send({ message: "Same response received, no action taken." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
