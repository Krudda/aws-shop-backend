export interface Movie {
    id?: string,
    count?: number,
    title: string,
    price: number,
    year: string,
    genre: string,
    director: string,
    actors: string,
    plot: string,
    country: string,
    poster: string,
    imdbRating: string,
    imdbID: string,
    type: MovieType
}

export enum MovieType {
    MOVIE = "Movie",
    CARTOON = "Animation"
}

export interface Stock {
    product_id: string,
    count: number
}