import { APIGatewayProxyHandler } from 'aws-lambda';
import { error500Response, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { movies } from '@products/movies';
import { Movie } from '@products/types';
import { addMovieService } from '@functions/createProduct/handler';

const fillDatabase: APIGatewayProxyHandler = async () => {
  const batchWriteMovies = async (moviesToLoad: Movie[]) => {
    try {
      for await (let movie of moviesToLoad) {
        await addMovieService(movie)
      }
    } catch (error) {
      throw new Error(error)
    }
  };

  try {
    await batchWriteMovies(movies);
    return formatJSONResponse({ body: "Movies added successfully" });
  } catch (error) {
    return error500Response();
  }
}

export const main = middyfy(fillDatabase);
