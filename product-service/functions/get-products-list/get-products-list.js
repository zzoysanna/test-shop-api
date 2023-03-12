import {errorResponse, formatJSONResponse} from "../../utils";
import {getData} from "../../dal";

export const getProductsList = async () => {
    try {
        console.log('Get products list');
        const result = await getData();
        return result
            ? formatJSONResponse(result)
            : errorResponse('No data was found', 404)
    } catch(error) {
        return errorResponse(error.message, 400)
    }
}

export default getProductsList;

