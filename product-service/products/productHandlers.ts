import { movies } from "./movies";
import { Movie } from './types';

export const getAllMoviesService: () => Movie[] = () => movies;

export const getMovieByIdService: (id: string) => Movie | null = (id) => {
    return movies.find(product => product.imdbID === id) || null
}