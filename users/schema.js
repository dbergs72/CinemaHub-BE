import mongoose from "mongoose";

const user_roles = ["ADMIN", "USER"];

const schema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    bio: { type: String, required: false, default: "" },
    role: { type: String, enum: user_roles, default: "USER" },
    following: [{ type: String, ref: "users", default: [] }],
    followers: [{ type: String, ref: "users", default: [] }],
    reels: [{ type: mongoose.Types.ObjectId, ref: "reels", default: [] }],
  },
  { collection: "users" },
);

export default schema;
