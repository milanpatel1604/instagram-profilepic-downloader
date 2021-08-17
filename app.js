const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const path=require('path');
const globalErrorHandler = require("./controllers/errorController");
const cors=require('cors');
const cookieParser=require('cookie-parser');
const upload=require('express-fileupload');
require('dotenv').config();


const adminRouter=require('./routes/adminRoutes');
const userRouter = require("./routes/userRoutes");
const meditationTrackRouter=require("./routes/meditationTrackRoutes");
const sleepTrackRouter=require("./routes/sleepTrackRoutes");
const relaxTrackRouter=require("./routes/relaxTrackRoutes");
const liveTrackRouter=require("./routes/liveTrackRoutes");
const notificationRouter=require("./routes/notificationRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.enable('strict routing')
app.use(upload());

app.use('/static', express.static('static'));
app.use(express.static(path.join(__dirname, 'views')));

app.use("/", adminRouter)
app.use("/api/users", userRouter);
app.use("/api/meditation", meditationTrackRouter);
app.use("/api/sleep", sleepTrackRouter);
app.use("/api/relax", relaxTrackRouter);
app.use("/api/live", liveTrackRouter);
app.use("/api/notification", notificationRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't found ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
