require('dotenv').config();
const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');
const { ImageProcessingBot } = require('./bot'); // Importar correctamente

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const bot = new ImageProcessingBot(); // Usar correctamente el constructor

server.post('/api/messages', async (req, res) => {
    try {
        await adapter.processActivity(req, res, async (context) => {
            await bot.run(context);
        });
    } catch (err) {
        console.error('Error processing activity', err);
        res.send(500);
    }
});
