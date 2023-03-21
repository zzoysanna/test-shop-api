import AWS from 'aws-sdk';

export const importProductsFile = async (event) => {
    const s3 = new AWS.S3();
    const name = event.queryStringParameters.name;

    if(!name) {
        return {
            statusCode: 400,
            message: "File name shouldn't be empty"
        }
    }

    try {
        const params = {
            Bucket: process.env.bucket,
            Key: `uploaded/${name}`,
            Expires: 60,
            ContentType: 'text/csv'
        }
        const url = await s3.getSignedUrl('putObject', params);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(url)
        }
    } catch (err) {
        return {
            statusCode: 500,
            message: err.message
        }
    }
}

export default importProductsFile;
