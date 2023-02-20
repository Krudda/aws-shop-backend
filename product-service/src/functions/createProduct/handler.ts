import { v4 as generateId } from 'uuid';
import { ddbDocClient } from "@libs/ddbDocClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { PRODUCT_TABLE_NAME, STOCKS_TABLE_NAME } from "../../../../utils";


export const addMovieService = async (rawMovie) => {
  const { count, ...movie } = rawMovie;
  try {
    const movieID = generateId();
    const addMovie = new PutCommand({
      TableName: PRODUCT_TABLE_NAME,
      Item: { id: movieID, ...movie },
    });
    const addMovieCount = new PutCommand({
      TableName: STOCKS_TABLE_NAME,
      Item: { product_id: movieID, count },
    });
    await ddbDocClient.send(addMovie);
    await ddbDocClient.send(addMovieCount);
  } catch (err) {
    throw new Error(err);
  }
};
const createProduct: APIGatewayProxyHandler = async (event) => {
  const { body } = event;

  console.log('body', body);

  try {
    await addMovieService(body);
    return formatJSONResponse({ body: "Movie added successfully" });
  } catch (error) {
    console.log('error', error)
    return error500Response();
  }
}

export const main = middyfy(createProduct);
