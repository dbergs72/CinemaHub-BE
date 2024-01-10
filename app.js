import express from "express";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./users/routes.js";
import ReviewRoutes from "./reviews/routes.js";
import ReelRoutes from "./reels/routes.js";
import MovieRoutes from "./movies/routes.js";
import omdbAPIRoutes from "./omdb/routes.js";
mongoose.connection.on("open", function (ref) {
  console.log("Connected to mongo server.");
});
mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!");
  return console.log(err);
});
mongoose.connect(
  "mongodb+srv://cinemahub-admin:L2tIRabOkI9fLDp6@cinemahub.y3xlihq.mongodb.net/CinemaHub",
);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", process.env.REACT_APP_FRONTEND_URL],
  }),
);
const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
    };
}
app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app);
ReviewRoutes(app);
ReelRoutes(app);
MovieRoutes(app);
omdbAPIRoutes(app);
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
