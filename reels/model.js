import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("reels", schema);
export default model;
