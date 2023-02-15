import { APIGatewayProxyHandler } from "aws-lambda";
import { error404Response, error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getMovieService } from '@products/productHandlers';

const getMovieById: APIGatewayProxyHandler = async (event) => {
  try {
    const { movieId = '' } = event.pathParameters;
    const movie = await getMovieService(movieId);

    if (movie) {
      return formatJSONResponse({ body: movie });
    } else {
      return error404Response("Sorry. This movie not found");
    }
  } catch (error) {
    return error500Response();
  }
};

export const main = middyfy(getMovieById);
