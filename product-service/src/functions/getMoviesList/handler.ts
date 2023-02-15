import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getAllMoviesService } from '@products/productHandlers';
import { APIGatewayProxyHandler } from 'aws-lambda';

const getMoviesList: APIGatewayProxyHandler = async () => {
  try {
    const movies = await getAllMoviesService();
    return formatJSONResponse({ body: movies });
  } catch (error) {
    return error500Response();
  }
}

export const main = middyfy(getMoviesList);
