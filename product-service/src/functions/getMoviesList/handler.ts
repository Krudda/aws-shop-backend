import { APIGatewayProxyHandler } from 'aws-lambda';
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ddbClient } from "@libs/ddbClient";
import { PRODUCT_TABLE_NAME, STOCKS_TABLE_NAME } from "../../../../utils";
import { Movie, Stock } from '@products/types';

const getMoviesList: APIGatewayProxyHandler = async () => {

  const getMoviesService = async (): Promise<Movie[]> => {
    const { Items } = await ddbClient.send(new ScanCommand({
      TableName: PRODUCT_TABLE_NAME
    }))
    return Items;
  }

  const getStockService = async (): Promise<Stock[]> => {
    const { Items } = await ddbClient.send(new ScanCommand({
      TableName: STOCKS_TABLE_NAME
    }))
    return Items;
  }

  try {
    const movies = await getMoviesService();
    const stocks = await getStockService();
    const res = movies.map(movie => {
      const count = stocks.find(item => (item.product_id === movie.id))?.count || 0
      return { ...movie, count }
    })
    return formatJSONResponse({ body: res });
  } catch (error) {
    return error500Response();
  }
}

export const main = middyfy(getMoviesList);
