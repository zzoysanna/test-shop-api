import {describe, fdescribe, expect, jest, test} from "@jest/globals";
import catalogBatchProcess from '../catalog-batch-process/catalog-batch-process';
import * as dal from '../../dal';

jest.spyOn(dal, 'saveItem').mockImplementation(() => Promise.resolve({}));

const awsMock = jest.mock('aws-sdk', () => {
    return { SNS: jest.fn(() => mockSNSInstance) }
})

describe('catalogBatchProcess', () => {
    test('should create products', async () => {
        const mockEvent = [
            {
                title: 'upload test 1',
                description: 'upload test',
                price: 200,
                count: 20
            },
            {
                title: 'upload test 2',
                description: 'upload test',
                price: 200,
                count: 20
            }
        ];
        const event = { Records: [{body: JSON.stringify(mockEvent[0])}, {body: JSON.stringify(mockEvent[1])}]}
        const res = await catalogBatchProcess(event, null, jest.fn());
        expect(dal.saveItem).toBeCalledTimes(2);
        expect(dal.saveItem).toBeCalledWith('upload test 1', 'upload test', 200, 20);
        expect(dal.saveItem).toBeCalledWith('upload test 2', 'upload test', 200, 20);
    })

    test('should not create products', async () => {
        const res = await catalogBatchProcess({}, null, jest.fn());
        expect(res.statusCode).toEqual(500);
    })
})
