import {formatJSONResponse} from "./format-json-response";

export const errorResponse = (message, statusCode) => {
    return formatJSONResponse({
        statusCode,
        message
    }, statusCode)
}
