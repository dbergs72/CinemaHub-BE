import model from "./model.js";

export const createUser = (user, reels) =>
  model.create({ ...user, reels: reels });
export const findAllUsers = () => model.find().populate("reels").exec();
export const findUserById = (userId) =>
  model.findOne({ _id: userId }).populate("reels").exec();

export const findUserByUsername = (username) =>
  model.findOne({ username: username }).populate("reels").exec();

export const findUserByCredentials = (usr, pass) =>
  model.findOne({ username: usr, password: pass }).populate("reels").exec();
export const findUsersByNames = (username, role, minFollowing) =>
  model.find({
    username: { $regex: username, $options: "i" },
    ...(role !== undefined ? { role: role } : {}),
    // Following is an array of following users ids, ensure that the length is greater than or equal to minFollowing
    ...(minFollowing !== undefined
      ? {
          following: { $size: parseInt(minFollowing) },
        }
      : {}),
  });
export const updateUser = (username, user) =>
  model.updateOne({ username: username }, { $set: user });
export const deleteUser = (username) => model.deleteOne({ username: username });
