import {errorResponse, formatJSONResponse} from "../../utils";
import AWS from "aws-sdk";
import {saveItem} from '../../dal';

export const catalogBatchProcess = async (event, context, callback) => {
    try {
        const items = event.Records.map(({body}) => body);
        const sns = new AWS.SNS();

        items.forEach(async item => {
            const {title, description, price, count} = JSON.parse(item);
            const res = await saveItem(title, description, price, count);
            if (res) {
                console.log('Create batch product: ', title, description, price, count)
                sendEmail(sns, item)
            }
        })

        callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        })
        
    } catch (error) {
        return errorResponse(error.message, error.statusCode || 500)
    }
}

const sendEmail = (sns, item) => {
    sns.publish({
        Subject: 'New products uploaded',
        Message: JSON.stringify(item),
        TopicArn: process.env.topicArn
    }, () => {
        console.log('send email', item);
    })
}

export default catalogBatchProcess;
