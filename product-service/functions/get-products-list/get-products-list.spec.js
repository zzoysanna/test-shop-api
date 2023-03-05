import {
    jest, describe, expect, test,
} from '@jest/globals';
import * as dal from '../../dal';
import getProductsList from './get-products-list';

const mockedProducts = [
    {
        id: '3',
        title: 'Mock title 3',
        description: 'Mock description 3',
        price: 32.99,
        count: 200
    },
    {
        id: '4',
        title: 'Mock title 4',
        description: 'Mock description 4',
        price: 72.95,
        count: 20
    }
]

jest
    .spyOn(dal, 'getData')
    .mockImplementation(() => Promise.resolve(mockedProducts))

describe('getProductsList', () => {
    test('should return products list', async () => {
        getProductsList().then(
            res => {
                const body = JSON.parse(res.body);
                expect(res.statusCode).toEqual(200);
                expect(body.length).toEqual(mockedProducts.length);
                expect(body).toEqual(mockedProducts);
                expect(body[0].id).toEqual(mockedProducts[0].id);
                expect(body[1].id).toEqual(mockedProducts[1].id);
            }
        )
    })
})
