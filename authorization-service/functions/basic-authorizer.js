const generatePolicy = (effect, resource) => {
    return {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
        }]
    }
}

const generateResponse = (principalId, effect, resource) => {
    return {
        principalId,
        policyDocument: generatePolicy(effect, resource)
    }
}

export const basicAuthorizer = async (event, context, callback) => {
    try {
        const {headers, methodArn} = event;
        const encoded = headers.Authorization.split(' ')[1];
        const buffer = Buffer.from(encoded, 'base64');
        const decoded = buffer.toString('utf-8');
        const policy = decoded === process.env.token
            ? generateResponse(decoded, 'Allow', methodArn)
            : generateResponse(decoded, 'Deny', methodArn);
        callback(null, policy);
    } catch(e) {
        callback('Unauthorized:' + e.message);
    }
}

export default basicAuthorizer
