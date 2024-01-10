import * as dao from "./dao.js";
import * as reviewDao from "../reviews/dao.js";

function UserRoutes(app) {
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  const findAllUsers = async (req, res) => {
    const users = await dao.findAllUsers();
    res.json(users);
  };
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };
  const findUserByUsername = async (req, res) => {
    const user = await dao.findUserByUsername(req.params.username);
    if (user) {
      res.json(user);
    } else {
      res.status(400).json({ error: "Username does not exist" });
    }
  };
  const findUserByCredentials = async (req, res) => {
    const user = await dao.findUserByCredentials(
      req.params.username,
      req.params.password,
    );
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const { username } = req.params;

    const user = await dao.findUserByUsername(username);
    // update the followers
    const followers = user.followers;
    for (let i = 0; i < followers.length; i++) {
      const follower = await dao.findUserByUsername(followers[i]);
      follower.following = follower.following.map((u) =>
        u === username ? req.body.username : u,
      );
      await dao.updateUser(follower.username, follower);
    }

    // update the following
    const followings = user.following;
    for (let i = 0; i < followings.length; i++) {
      const following = await dao.findUserByUsername(followings[i]);
      following.followers = following.followers.map((u) =>
        u === username ? req.body.username : u,
      );
      await dao.updateUser(following.username, following);
    }

    // update our reviews
    const reviews = await reviewDao.findReviewsByUsername(username);
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      review.username = req.body.username;
      await reviewDao.updateReview(review._id, review);
    }

    // update the user
    try {
      const status = await dao.updateUser(username, req.body);
    } catch (e) {
      res.status(400).json({ error: "Username already taken" });
      return
    }
    
    // Return Updated User
    const updatedUser = await dao.findUserByUsername(req.body.username);
    
    // Update the session of the user, if its an admin don't do anything
    if (req.session["currentUser"] && req.session["currentUser"].role === "USER") {
      req.session["currentUser"] = updatedUser;
    }

    // Update the session of the user, if its an admin and they are updating their own profile
    if (req.session["currentUser"] && req.session["currentUser"].role === "ADMIN" && req.session["currentUser"].username === req.body.username) {
      req.session["currentUser"] = updatedUser;
    }

    // Return the updated user
    res.json(updatedUser);

  };
  const deleteUser = async (req, res) => {
    const { username } = req.params;
    const user = await dao.findUserByUsername(username);
    // update the followers
    const followers = user.followers;
    for (let i = 0; i < followers.length; i++) {
      const follower = await dao.findUserByUsername(followers[i]);
      follower.following = follower.following.filter((u) => u !== username);
      await dao.updateUser(follower.username, follower);
    }

    // update the following
    const followings = user.following;
    for (let i = 0; i < followings.length; i++) {
      const following = await dao.findUserByUsername(followings[i]);
      following.followers = following.followers.filter((u) => u !== username);
      await dao.updateUser(following.username, following);
    }

    // delete our reviews
    const reviews = await reviewDao.findReviewsByUsername(username);
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      await reviewDao.deleteReview(review._id);
    }

    // delete the user
    const status = await dao.deleteUser(req.params.username);

    res.json(status);
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ error: "Username already taken" });
    } else {
      const currentUser = await dao.createUser(req.body);
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    }
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signout = (req, res) => {
    req.session.destroy();
    res.json({ status: "OK" });
  };
  const account = async (req, res) => {
    res.json(req.session["currentUser"]);
  };

  const addFollower = async (req, res) => {
    const { username } = req.params;
    const currentUser = req.session["currentUser"];
    const followedUser = await dao.findUserByUsername(username);

    if (currentUser && followedUser) {
      currentUser.following.push(followedUser.username);
      followedUser.followers.push(currentUser.username);
      console.log(currentUser);
      await dao.updateUser(currentUser.username, currentUser);
      await dao.updateUser(followedUser.username, followedUser);
      res.json(followedUser);
    } else {
      res.status(400).json({ error: "Username does not exist" });
    }
  };

  const unFollow = async (req, res) => {
    const { username } = req.params;
    const currentUser = req.session["currentUser"];
    const followedUser = await dao.findUserByUsername(username);

    if (currentUser && followedUser) {
      currentUser.following = currentUser.following.filter(
        (u) => u !== username,
      );
      followedUser.followers = followedUser.followers.filter(
        (u) => u !== currentUser.username,
      );
      await dao.updateUser(currentUser.username, currentUser);
      await dao.updateUser(followedUser.username, followedUser);
      res.json(followedUser);
    } else {
      res.status(400).json({ error: "Username does not exist" });
    }
  };

  const findUsersByNames = async (req, res) => {
    const { username } = req.params;
    const { role, minFollowing} = req.query;
    const users = await dao.findUsersByNames(username, role, minFollowing);
    res.json(users);
  }

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.get("/api/users/username/:username", findUserByUsername);
  app.get("/api/users/credentials/:usr/:pass", findUserByCredentials);
  app.put("/api/users/:username", updateUser);
  app.delete("/api/users/:username", deleteUser);

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/account", account);

  app.put("/api/users/username/:username/follow", addFollower);
  app.put("/api/users/username/:username/unfollow", unFollow)

  app.get("/api/users/names/:username", findUsersByNames)
}

export default UserRoutes;
