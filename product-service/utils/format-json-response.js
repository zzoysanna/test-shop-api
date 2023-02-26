export const formatJSONResponse = (response, statusCode = 200) => {
    return {
        isBase64Encoded: false,
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(response)
    }
}
