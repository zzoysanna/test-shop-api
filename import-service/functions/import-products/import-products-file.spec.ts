import {describe, expect, jest, test} from "@jest/globals";
import importProductsFile from '../import-products/import-products-file';

const mockS3Instance = {
    copyObject: jest.fn().mockReturnThis(),
    getSignedUrl: jest.fn().mockReturnThis(),
    promise: jest.fn().mockReturnThis(),
    catch: jest.fn(),
}

jest.mock('aws-sdk', () => {
    return { S3: jest.fn(() => mockS3Instance) }
})

describe('importFileParser', () => {
    test('should not run import without filename', async () => {
        const mockRequest = {
            queryStringParameters: {
                foo: 'bar'
            }
        };
        const res = await importProductsFile(mockRequest);
        expect(res.statusCode).toEqual(400);
        expect(res.message).toEqual('File name shouldn\'t be empty');
    })

    test('should run import if filename is present', async () => {
        const mockRequest = {
            queryStringParameters: {
                name: 'file.csv'
            }
        };
        const res = await importProductsFile(mockRequest);
        expect(mockS3Instance.getSignedUrl).toHaveBeenCalledWith("putObject", {
            Bucket: undefined,
            ContentType: "text/csv",
            Expires: 60,
            Key: "uploaded/file.csv"
        });
        expect(res.statusCode).toEqual(200);
    })
})
