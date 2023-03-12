#!/bin/sh

source .env

productsTable=$PRODUCTS_TABLE_NAME;
stocksTable=$STOCKS_TABLE_NAME;

lorem() {
  curl -s http://metaphorpsum.com/sentences/${1-3} | pbcopy
  pbpaste | grep .
}

function createJsonProduct {
  ID=$(uuidgen)
  DESCRIPTION=$(lorem 1)
  TITLE=$((lorem 1) | grep -o "^\w*\b")
  PRICE=$(((RANDOM%100)+1))
  QUANTITY=$(((RANDOM%10)+10))

  PRODUCT_JSON_STRING=$( jq -n \
      --arg id "$ID" \
      --arg de "$DESCRIPTION" \
      --arg tl "$TITLE" \
      --arg pr "$PRICE" \
      '{id: { S: $id}, description: {S: $de}, title: {S: $tl}, price: {N: $pr}}' )

  STOCK_JSON_STRING=$( jq -n \
    --arg id "$ID" \
    --arg qa "$QUANTITY" \
    '{product_id: { S: $id}, count: {N: $qa}}' )

  #  echo $PRODUCT_JSON_STRING
  #  echo $STOCK_JSON_STRING
  aws dynamodb put-item --table-name $productsTable --item "$PRODUCT_JSON_STRING"
  aws dynamodb put-item --table-name $stocksTable --item "$STOCK_JSON_STRING"
}

for i in 1 2 3 4 5 6 7 8 9
do
   createJsonProduct
done
