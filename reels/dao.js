import model from "./model.js";

export const createReel = (reel, movies) =>
  model.create({ ...reel, movies: movies });
export const findAllReels = () =>
  model.find().populate("movies").exec();
export const findReelById = (reelId) =>
  model.findOne({ _id: reelId }).populate("movies").exec();
export const updateReel = (reelId, reel) =>
  model.updateOne({ _id: reelId }, { $set: reel });
export const deleteReel = (reelId) =>
  model.deleteOne({ _id: reelId });
export const addMovieToReel = (reelId, movieId) =>
  model.updateOne({ _id: reelId }, { $push: { movies: movieId } });