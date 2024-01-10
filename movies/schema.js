import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    title: { type: String, required: true },
    omdbId: { type: String, required: true },
    plot: { type: String, required: false },
    poster: { type: String, required: false },
  },
  { collection: "movies" },
);

export default schema;
