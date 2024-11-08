const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

app.post('/shopify-webhook', async (req, res) => {
    console.log('Received webhook payload:', req.body);

    const { id: store_id, name: theme_name, role: theme_role, updated_at } = req.body || {};

    if (!store_id || !theme_name || !theme_role || !updated_at) {
        console.error('Received data is missing required fields');
        return res.status(400).send('Received data is missing required fields');
    }

    const slackMessage = {
        channel: SLACK_CHANNEL_ID,
        text: `Alert: The theme on store ID *${store_id}* has changed to *${theme_name}* with role *${theme_role}* as of *${updated_at}*.`,
    };

    try {
        const slackResponse = await axios.post('https://slack.com/api/chat.postMessage', slackMessage, {
            headers: {
                Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        if (slackResponse.data.ok) {
            console.log('Message sent to Slack successfully.');
            res.status(200).send('Notification sent to Slack.');
        } else {
            console.error('Error sending to Slack:', slackResponse.data.error);
            res.status(500).send('Error sending notification.');
        }
    } catch (error) {
        console.error('Error sending to Slack:', error.response?.data || error.message);
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
