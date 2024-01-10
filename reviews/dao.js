import model from "./model.js";

export const createReview = async (review, movieId) =>
  await model.create({ ...review, movieId: movieId });
export const findAllReviews = () => model.find().populate("movieId").exec();
export const findReviewById = (reviewId) =>
  model.findOne({ _id: reviewId }).populate("movieId").exec();
export const findReviewsByMovieId = (movieId) =>
  model.find({ movieId: movieId }).populate("movieId").exec();
export const findReviewsByUsername = (username) =>
  model.find({ username: username }).populate("movieId").exec();
export const updateReview = (reviewId, review) =>
  model.updateOne({ _id: reviewId }, { $set: review });
export const deleteReview = (reviewId) => model.deleteOne({ _id: reviewId });
