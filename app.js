const express = require("express");
const session = require("express-session");
const cors = require("cors");
const redis = require("ioredis");
let RedisStore = require("connect-redis").default

const { REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT
});

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();


app.enable("trust proxy");
app.use(cors({}))
app.use(session({
  store: new RedisStore({client : redisClient}),
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 
  }
}))

app.use(express.json());


app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


module.exports = app;