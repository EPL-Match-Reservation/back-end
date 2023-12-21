const express = require("express");
const https = require("https");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

/////////////////////////////all routes here ///////////////////
//////////////todo////////////////
const matchRouter = require("./routes/matchRoute");

const cors = require("cors");
const { errorHandler } = require("./error_handling/errors");

const app = express();
app.enable("trust proxy");
app.use(mongoSanitize());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.FRONTDOMAIN,
      process.env.CROSSDOMAIN,
      "http://localhost:3000",
    ],
    allowedHeaders: "Content-Type,*",
    methods: "GET,PUT,POST,DELETE,OPTIONS,PATCH",
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// Serving static files
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES


//////////todo /////////////////

app.use("/api/v1/match", matchRouter);
// app.use("/api/v1/user", userRouter);
app.use(errorHandler);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    errorMessage: "Invaild Request URL",
  });
});

module.exports = app;
