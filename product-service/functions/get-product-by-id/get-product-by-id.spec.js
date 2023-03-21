import {
    jest, describe, expect, test
} from '@jest/globals';
import getProductById from '../get-product-by-id/get-product-by-id';
import * as dal from '../../dal';

const mockedProduct = {
    id: '2',
    title: 'Mock title 1',
    description: 'Mock description 1',
    price: 12.99,
    count: 20
};

describe('getProductById', () => {
    test('should get existing product by id', async () => {
        const mockRequest = {
            pathParameters: {
                productId: '2'
            }
        };
        jest
            .spyOn(dal, 'getItemData')
            .mockImplementation(() => Promise.resolve(mockedProduct))
        getProductById(mockRequest).then(
            res => {
                expect(JSON.parse(res.body)).toEqual(mockedProduct);
                expect(res.statusCode).toEqual(200);
            }
        );
    })

    test('should get 404 error if no such product', async () => {
        const mockRequest = {
            pathParameters: {
                productId: 'test'
            }
        };
        jest
            .spyOn(dal, 'getItemData')
            .mockImplementation(() => Promise.resolve(null))
        getProductById(mockRequest).then(
            res => {
                expect(res.statusCode).toEqual(404);
            }
        );
    })
})
