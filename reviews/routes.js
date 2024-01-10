import * as dao from "./dao.js";

function ReviewRoutes(app) {
  const createReview = async (req, res) => {
    const review = await dao.createReview(req.body.review, req.body.movieId);
    res.json(review);
  };
  const findAllReviews = async (req, res) => {
    const reviews = await dao.findAllReviews();
    res.json(reviews);
  };
  const findReviewById = async (req, res) => {
    const review = await dao.findReviewById(req.params.reviewId);
    res.json(review);
  };
  const findReviewsByMovieId = async (req, res) => {
    const review = await dao.findReviewsByMovieId(req.params.movieId);
    res.json(review);
  };
  const findReviewsByUsername = async (req, res) => {
    const review = await dao.findReviewsByUsername(req.params.username);
    res.json(review);
  };
  const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const status = await dao.updateReview(reviewId, req.body);
    res.json(status);
  };
  const deleteReview = async (req, res) => {
    const status = await dao.deleteReview(req.params.reviewId);
    res.json(status);
  };

  app.post("/api/reviews", createReview);
  app.get("/api/reviews", findAllReviews);
  app.get("/api/reviews/:reviewId", findReviewById);
  app.get("/api/reviews/movie/:movieId", findReviewsByMovieId);
  app.get("/api/reviews/username/:username", findReviewsByUsername);
  app.put("/api/reviews/:reviewId", updateReview);
  app.delete("/api/reviews/:reviewId", deleteReview);
}

export default ReviewRoutes;
