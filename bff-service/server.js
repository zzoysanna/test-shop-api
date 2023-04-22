import express from 'express';
import * as dotenv from 'dotenv'
import axios from "axios";

dotenv.config();
const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.all('*/', (req, res) => {
    const {originalUrl, method, body} = req;
    const recipient = originalUrl.split('/')[1];
    const recipientURL = process.env[recipient];

    if(recipientURL) {
        const config = {
            method: method,
            url: `${recipientURL}/${originalUrl.replace(recipient + '/', '')}`,
            ...(Object.keys(body || {}).length > 0 && {data: body})
        }
        axios(config)
            .then((response) => res.json(response.data))
            .catch((err) => {
                if(err.response) {
                    const {status, data} = err.response;
                    res.status(status).json(data);
                } else {
                    res.status(500).json({error: err.message});
                }
            })
    } else {
        res.status(502).json({error: 'Cannot process request'});
    }
})
