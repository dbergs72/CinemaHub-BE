import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    title: { type: String, required: true },
    movies: [{ type: mongoose.Types.ObjectId, ref: "movies", required: true }],
  },
  { collection: "reels" },
);

export default schema;
