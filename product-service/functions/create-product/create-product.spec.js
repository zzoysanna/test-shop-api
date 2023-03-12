import {describe, expect, jest, test} from "@jest/globals";
import createProduct from '../create-product/create-product';
import * as dal from '../../dal';

const errMsgText = 'Data is incorrect: title and description should not be empty'
const errMsgNumbers = 'Data is incorrect: price and count should be more then 0'
const success = 'OK';

jest.spyOn(dal, 'saveItem')

describe('createProduct', () => {
    test('should create product', async () => {
        const mockRequest = {
            title: 'test',
            description: 'test',
            price: 20,
            count: 20
        };
        const res = await createProduct({body: JSON.stringify(mockRequest)});
        expect(dal.saveItem).toBeCalledWith('test', 'test', 20, 20);
        expect(JSON.parse(res.body)).toEqual(success);
        expect(res.statusCode).toEqual(200);
    })

    test('should not create product without title', async () => {
        const mockRequest = {
            title: undefined,
            description: 'test',
            price: 20,
            count: 20
        };
        const res = await createProduct({body: JSON.stringify(mockRequest)});
        expect(dal.saveItem).toBeCalledWith(undefined, 'test', 20, 20);
        expect(JSON.parse(res.body).message).toEqual(errMsgText);
        expect(res.statusCode).toEqual(500);
    })

    test('should not create product with negative count', async () => {
        const mockRequest = {
            title: 'test',
            description: 'test',
            price: 20,
            count: -20
        };
        const res = await createProduct({body: JSON.stringify(mockRequest)});
        expect(dal.saveItem).toBeCalledWith('test', 'test', 20, -20);
        expect(JSON.parse(res.body).message).toEqual(errMsgNumbers);
        expect(res.statusCode).toEqual(500);
    })
})
