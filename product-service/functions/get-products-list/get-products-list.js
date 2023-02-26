import {getData} from "../../data";
import {errorResponse, formatJSONResponse} from "../../utils";

export const getProductsList = async () => {
    try {
        const products = getData();
        return products
            ? formatJSONResponse(products)
            : errorResponse('No data was found', 404)
    } catch(error) {
        return errorResponse(error.message, 400)
    }
}

export default getProductsList;

