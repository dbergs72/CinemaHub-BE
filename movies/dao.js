import model from "./model.js";

export const createMovie = (movie) => model.create(movie);
export const findAllMovies = () => model.find();
export const findMovieById = (movieId) => model.findOne({ _id: movieId });
export const findMovieByTitle = (title) => model.findOne({ title: title });
export const findMovieByOmdbID = (omdbId) => model.findOne({ omdbId: omdbId });
export const updateMovie = (title, movie) =>
  model.updateOne({ title: title }, { $set: movie });
export const deleteMovie = (movieId) => model.deleteOne({ _id: movieId });
