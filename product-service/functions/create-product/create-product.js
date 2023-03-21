import {errorResponse, formatJSONResponse} from "../../utils";
import {saveItem} from '../../dal';

export const createProduct = async (event) => {
    try {
        const {title, description, price, count}  = JSON.parse(event.body);
        console.log('Create product: ', title, description, price, count)
        const res = await saveItem(title, description, price, count);
        return res?.message && res?.statusCode
            ? errorResponse(res.message, res.statusCode)
            : formatJSONResponse('OK')
    } catch (error) {
        return errorResponse(error.message, error.statusCode || 500)
    }
}

export default createProduct;
