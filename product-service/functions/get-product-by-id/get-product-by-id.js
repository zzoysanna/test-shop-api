import {errorResponse, formatJSONResponse} from "../../utils";
import {getItemData} from '../../dal'

export const getProductById = async (event) => {
    const id = event.pathParameters.productId;
    try {
        console.log('Get product by id: ', id)
        const currentProduct = await getItemData(id);
        return currentProduct
            ? formatJSONResponse(currentProduct)
            : errorResponse('A product with the specified ID was not found', 404);
    } catch (error) {
        return errorResponse(error.message, 400)
    }
}

export default getProductById;
