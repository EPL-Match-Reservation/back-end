const express = require("express");
const https = require("https");
const cors = require("cors");
const morgan = require("morgan");

const userRouter = require(`${__dirname}/routes/userRouter`);
const matchRouter = require(`${__dirname}/routes/matchRouter`);
const authRouter = require(`${__dirname}/routes/authRouter`);
const stadiumRouter = require(`${__dirname}/routes/stadiumRouter`);
const teamRouter = require(`${__dirname}/routes/teamRouter`);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [
      // process.env.FRONTDOMAIN,
      // process.env.CROSSDOMAIN,
      "http://localhost:3000",
    ],
    allowedHeaders: ["Content-Type", "Authorization"], // Include "Authorization" in allowedHeaders
    methods: "GET,PUT,POST,DELETE,OPTIONS,PATCH",
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log("Hello form the middleware ❤️");
    next();
  });
}

// 3) ROUTES

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/match", matchRouter);
app.use("/api/v1/stadium", stadiumRouter);
app.use("/api/v1/team", teamRouter);
// app.use("/api/v1/match", matchRouter);
// app.use("/api/v1/stadium", matchRouter);
// app.use("/api/v1/reservation", matchRouter);

// Exporting app
module.exports = app;
