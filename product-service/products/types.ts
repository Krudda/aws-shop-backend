export interface Movie {
    id?: string,
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
    imdbID: string
}

export interface Stock {
    product_id: string,
    count: number
}