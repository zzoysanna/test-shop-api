import {errorResponse} from "../utils";
import AWS from 'aws-sdk';
import {v4 as uuidv4} from "uuid";
const dynamo = new AWS.DynamoDB.DocumentClient();

export const getItemData = (id) => {
    return Promise.all([
        dynamo.get({
            TableName: process.env.productsTableName,
            Key: {"id": id}
        }).promise(),
        dynamo.get({
            TableName: process.env.stocksTableName,
            Key: {"product_id": id}
        }).promise()
    ])
        .then(([product, stock]) => ({
            ...product.Item,
            count: stock.Item.count
        }))
        .catch(error => errorResponse(error.message, error.statusCode));
}

export const getData = () => {
    return Promise.all([
        dynamo.scan({ TableName: process.env.productsTableName }).promise(),
        dynamo.scan({ TableName: process.env.stocksTableName }).promise(),
    ])
        .then(([products, stocks]) => joinData(products.Items, stocks.Items))
        .catch(error => errorResponse(error.message, error.statusCode));
}

const joinData = (products, stocks) => {
    return products.map((product, i) => {
        let currentStocksItem = product.id === stocks[i].product_id
            ? stocks[i]
            : stocks.find(item => item.product_id === product.id)
        return {
            ...product,
            count: currentStocksItem.count
        }
    })
}

export const saveItem = (title, description, price, count) => {
    const id = uuidv4();
    if(!title || !description) {
        throw new Error('Data is incorrect: title and description should not be empty');
    }
    if(count < 0 || price <= 0) {
        throw new Error('Data is incorrect: price and count should be more then 0')
    }
    return dynamo.transactWrite({
        TransactItems: [
            {
                Put: {
                    TableName: process.env.productsTableName,
                    Item: {
                        id,
                        title,
                        description,
                        price
                    },
                },
            },
            {
                Put: {
                    TableName: process.env.stocksTableName,
                    Item: {
                        product_id: id,
                        count
                    }
                },
            }
        ]
    }).promise().catch(error => errorResponse(error.message, error.statusCode));
}
