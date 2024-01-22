import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:'32kb'}))
app.use(express.urlencoded({extended: true, limit: '32kb'}))
app.use(express.static("public"))
app.use(cookieParser());

// import Routes
import userRouter from './routes/user.routes.js';
import healthRouter from "./routes/healthChecker.routes.js";
import dashboard from "./routes/dashboard.routes.js";
import likesRouter from "./routes/likes.routes.js";
import tweetRouter from "./routes/tweets.routes.js";
import commentsRouter from "./routes/comments.routes.js";
import videoRouter from "./routes/videos.routes.js";
import playListRouter from "./routes/playlist.routes.js";

app.use('/server/users', userRouter);
app.use("/server/healthcheck", healthRouter);
app.use("/server/dashboard", dashboard);
app.use("/server/likes", likesRouter);
app.use("/server/Tweets", tweetRouter);
app.use("/server/comments", commentsRouter);
app.use("/server/videos", videoRouter);
app.use("/server/playlist", playListRouter);

export { app };