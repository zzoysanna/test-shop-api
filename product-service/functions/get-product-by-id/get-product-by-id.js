import {getData} from "../../data"
import {errorResponse, formatJSONResponse} from "../../utils";

export const getProductById = async (event) => {
    const id = event.pathParameters.productId;
    try {
        const currentProduct = getData().find(item => item.id === id);
        return currentProduct
            ? formatJSONResponse(currentProduct)
            : errorResponse('A product with the specified ID was not found', 404);
    } catch (error) {
        return errorResponse(error.message, 400)
    }
}

export default getProductById;
