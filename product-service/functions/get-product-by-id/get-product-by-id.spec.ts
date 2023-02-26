import {
    jest, describe, expect, test
} from '@jest/globals';
import getProductById from '../get-product-by-id/get-product-by-id';
import * as data from '../../data';

const mockedProducts = [
    {
        id: '1',
        title: 'Mock title 1',
        description: 'Mock description 1',
        price: 12.99,
        count: 20
    },
    {
        id: '2',
        title: 'Mock title 2',
        description: 'Mock description 2',
        price: 12.99,
        count: 20
    }
]

jest
    .spyOn(data, 'getData')
    .mockImplementation(() => mockedProducts)

describe('getProductById', () => {
    test('should get existing product by id', async () => {
        const mockRequest = {
            pathParameters: {
                productId: '2'
            }
        };
        getProductById(mockRequest).then(
            res => {
                expect(JSON.parse(res.body)).toEqual(mockedProducts[1]);
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
        getProductById(mockRequest).then(
            res => {
                expect(res.statusCode).toEqual(404);
            }
        );
    })
})
