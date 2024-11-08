const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

app.post('/shopify-webhook', async (req, res) => {
    const { theme } = req.body;
    const { id: store_id, name: theme_name, published_at: updated_at } = theme;

    const slackMessage = {
        text: `Alert: The theme on store ID *${store_id}* has changed to *${theme_name}* as of *${updated_at}*.`,
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
