const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const userRouter = require("./routes/userRoutes");
const meditationTrackRouter=require("./routes/meditationTrackRoutes");
const sleepTrackRouter=require("./routes/sleepTrackRoutes");
const relaxTrackRouter=require("./routes/relaxTrackRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/users", userRouter);
app.use("/api/meditation", meditationTrackRouter);
app.use("/api/sleep", sleepTrackRouter);
app.use("/api/relax", relaxTrackRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't found ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
