import * as dao from "./dao.js";

function MovieRoutes(app) {
  const createMovie = async (req, res) => {
    const movie = await dao.createMovie(req.body);
    res.json(movie);
  };
  const findAllMovies = async (req, res) => {
    const movies = await dao.findAllMovies();
    res.json(movies);
  };
  const findMovieById = async (req, res) => {
    const movie = await dao.findMovieById(req.params.movieId);
    res.json(movie);
  };
  const findMovieByTitle = async (req, res) => {
    const movie = await dao.findMovieByTitle(req.params.title);
    res.json(movie);
  };
  const findMovieByOmdbID = async (req, res) => {
    const movie = await dao.findMovieByOmdbID(req.params.omdbId);
    res.json(movie);
  };
  const updateMovie = async (req, res) => {
    const { title } = req.params;
    const status = await dao.updateMovie(title, req.body);
    res.json(status);
  };
  const deleteMovie = async (req, res) => {
    const status = await dao.deleteMovie(req.params.movieId);
    res.json(status);
  };

  app.post("/api/movies", createMovie);
  app.get("/api/movies", findAllMovies);
  app.get("/api/movies/:movieId", findMovieById);
  app.get("/api/movies/title/:title", findMovieByTitle);
  app.get("/api/movies/omdbId/:omdbId", findMovieByOmdbID);
  app.put("/api/movies/:title", updateMovie);
  app.delete("/api/movies/:movieId", deleteMovie);
}

export default MovieRoutes;
