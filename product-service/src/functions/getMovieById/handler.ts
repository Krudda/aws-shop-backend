import { APIGatewayProxyHandler } from "aws-lambda";
import { middyfy } from '@libs/lambda';
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { error404Response, error500Response, formatJSONResponse } from '@libs/api-gateway';
import { ddbDocClient } from "@libs/ddbDocClient";
import { Movie } from "@products/types";
import { PRODUCT_TABLE_NAME, STOCKS_TABLE_NAME } from "../../../../utils";


const getMovieById: APIGatewayProxyHandler = async (event) => {
  const { movieId = '' } = event.pathParameters;

  console.log('event', event);

  const getMovieService = async (movieId: string): Promise<Movie> => {
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: PRODUCT_TABLE_NAME,
        Key: {
          id: movieId
        },
      })
    );
    return Item;
  };

  const getStockService = async (movieId: string): Promise<number> => {
    const { Item } = await ddbDocClient.send(
      new GetCommand({
        TableName: STOCKS_TABLE_NAME,
        Key: {
          product_id: movieId
        },
      })
    );
    return Item ? Item.count : 0;
  };

  try {
    const movie = await getMovieService(movieId);
    const count = await getStockService(movieId);

    if (movie) {
      return formatJSONResponse({ body: { ...movie, count } });
    } else {
      return error404Response("Sorry. This movie not found");
    }
  } catch (error) {
    return error500Response();
  }
};

export const main = middyfy(getMovieById);
