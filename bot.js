const { ActivityHandler } = require('botbuilder');
const axios = require('axios');
const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');
const os = require('os');

class ImageProcessingBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const attachments = context.activity.attachments;
            if (attachments && attachments.length > 0) {
                for (let file of attachments) {
                    const fileData = await this.downloadFile(file.contentUrl);
                    const base64Data = fileData.toString('base64');
                    const result = await this.processImageWithPython(base64Data);
                    await context.sendActivity(`Image processed: ${result}`);
                }
            } else {
                await context.sendActivity("Please send an image.");
            }
            await next();
        });
    }

    async downloadFile(url) {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': `Bearer ${process.env.MicrosoftAppPassword}`
            }
        });
        return Buffer.from(response.data, 'binary');
    }

    async processImageWithPython(base64Data) {
        return new Promise((resolve, reject) => {
            // Guardar los datos base64 en un archivo temporal
            const tempFilePath = path.join(os.tmpdir(), `${Date.now()}_image.txt`);
            fs.writeFileSync(tempFilePath, base64Data);

            // Llamar al script de Python con la ruta del archivo temporal
            execFile('python', ['process_image.py', tempFilePath], (error, stdout, stderr) => {
                // Eliminar el archivo temporal después de procesar
                fs.unlinkSync(tempFilePath);

                if (error) {
                    reject(error);
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    }
}

module.exports.ImageProcessingBot = ImageProcessingBot;
