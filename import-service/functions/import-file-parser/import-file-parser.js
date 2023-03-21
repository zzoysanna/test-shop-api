import AWS from "aws-sdk";
import csv from "csvtojson";

export const importFileParser = async (event) => {
    const s3 = new AWS.S3({region: "eu-central-1"});
    let res = [];

    try {
        for (const record of event.Records) {
            const params = {
                Bucket: process.env.bucket,
                Key: record.s3.object.key
            }
            const parseOptions = {
                delimiter: ';',
                output: 'json'
            }
            const copyParams = {
                Bucket: process.env.bucket,
                CopySource: process.env.bucket + '/' + record.s3.object.key,
                Key: record.s3.object.key.replace('uploaded', 'parsed')
            }

            const stream = s3.getObject(params).createReadStream();

            await csv(parseOptions).fromStream(stream)
                .then(json => res = json)
                .then(() => s3.copyObject(copyParams).promise())
                .then(() => s3.deleteObject(params).promise())

            res.forEach((item, i) => console.log('item ', i, ': ', item))
        }
        return {
            statusCode: 202,
        }
    } catch (err) {
        return {
            statusCode: 500,
            message: err.message
        }
    }
}
export default importFileParser;
