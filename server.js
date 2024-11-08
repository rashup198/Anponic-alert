const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

app.post('/shopify-webhook', async (req, res) => {
    console.log('Received webhook payload:', req.body);

    if (!req.body || !req.body.name) {
        console.error('Received data does not include a theme object');
        return res.status(400).send('Received data does not include a theme object');
    }

    const { id: store_id, name: theme_name, role: theme_role, updated_at } = req.body;

    const slackMessage = {
        text: `Alert: The theme on store ID *${store_id}* has changed to *${theme_name}* with role *${theme_role}* as of *${updated_at}*.`,
    };

    try {
        await axios.post(SLACK_WEBHOOK_URL, slackMessage);
        res.status(200).send('Notification sent to Slack.');
    } catch (error) {
        console.error('Error sending to Slack:', error);
        res.status(500).send('Error sending notification.');
    }
});

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
