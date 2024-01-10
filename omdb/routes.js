const API_KEY = "9f564754"; //"d35a225d"
const BASE_API = `https://www.omdbapi.com/?apikey=${API_KEY}&`;
import { findMovieById } from "../movies/dao.js";
import { findUserByUsername } from "../users/dao.js";
function omdbAPIRoutes(app) {
    const findMovieByImdbID = async (req, res) => {
        const { imdbId } = req.params;
        const response = await fetch(`${BASE_API}i=${imdbId}`);
        const movie = await response.json();
        res.json(movie);
    }

    const searchMedia = async (req, res) => {
        const filters = req.body;
        const currentUser = req.session["currentUser"];
        let url = `${BASE_API}s=${filters.term}`;
        if (filters.year && filters.year.length > 0) {
            url += `&y=${filters.year}`;
        }
        if (filters.type && filters.type !== "media") {
            url += `&type=${filters.type}`;
        }
        if (filters.pageNumber && filters.pageNumber > 0) {
            url += `&page=${filters.pageNumber}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            res.status(400).send("Error searching for media");
            return;
        }
        const results = await response.json();
        if (results.Search && currentUser && currentUser.reels && currentUser.reels.length > 0) {
            const apiMovies = results.Search;
            let apiMoviesOmdbIds = [];
            const reelsOmdbIdsPromises = currentUser.reels.map(async reel => {
                const movieIdsPromises = reel.movies.map(async movieId => {
                    const movie = await findMovieById(movieId);
                    apiMoviesOmdbIds.push({id: movie.omdbId, title: reel.title, username: currentUser.username});
                });
                await Promise.all(movieIdsPromises);
            });
            // map over currentUsers following and find their reels, then find the movies in those reels and add them to apiMoviesOmdbIds
            const followingOmdbIdsPromises = currentUser.following.map(async follower => {
                const followerObject = await findUserByUsername(follower);
                const followerReels = followerObject.reels;
                const followerReelsMoviesPromises = followerReels.map(async reel => {
                    const movieIdsPromises = reel.movies.map(async movieId => {
                        const movie = await findMovieById(movieId);
                        apiMoviesOmdbIds.push({id: movie.omdbId, title: reel.title, username: followerObject.username});
                    });
                    await Promise.all(movieIdsPromises);
                });
                await Promise.all(followerReelsMoviesPromises);
            });
            await Promise.all([...reelsOmdbIdsPromises, ...followingOmdbIdsPromises]);
            const combinedMovies = apiMovies.map(apiMovie => {
                apiMovie.isInReels = apiMoviesOmdbIds.find(movie => {
                    return movie.id === apiMovie.imdbID
                });
                if (apiMovie.isInReels) {
                    apiMovie.reelTitle = apiMovie.isInReels.title;
                    apiMovie.reelUsername = apiMovie.isInReels.username;
                }
                return apiMovie;
            });
            results.Search = combinedMovies;
        }
        res.json(results);
    }

    app.get("/api/omdb/:imdbId", findMovieByImdbID);
    app.post("/api/omdb/search", searchMedia);
}

export default omdbAPIRoutes;