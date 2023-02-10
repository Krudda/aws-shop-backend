// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { error404Response, error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getMovieByIdService } from '@products/productHandlers';

const getMovieById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { movieId = '' } = event.pathParameters;
    const movie = getMovieByIdService(movieId);
    if (movie) {
      return formatJSONResponse({ body: movie });
    } else {
      return error404Response("Sorry. This movie not found");
    }
  } catch (error) {
    return error500Response("Something went wrong");
  }
};

export const main = middyfy(getMovieById);
