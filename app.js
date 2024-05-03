// BASE SETUP
// ==============================================
const { io, server, app } = require("./socket/socket.js");
const { connect } = require("./config/mongoose.js");
const corsMiddleware = require("./middlewares/cors.js");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const job = require("./cron/cron.js");
app.use(bodyParser.json());

const { EventEmitter } = require("events");
const instrumentRouter = require("./routes/marketplaceRoutes/instrument.route.js");
const exchangeRouter = require("./routes/marketplaceRoutes/exchange.route.js");
const userRoutes = require("./routes/userRoutes/index");
const courseRoutes = require("./routes/courseRoutes/courseRoutes");
const classRoutes = require("./routes/classRoutes/classRoutes.js");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes/message.route.js");

const { userVerification } = require("./middlewares/authJWT");

// ==============================================

connect();
// job.start();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(bodyParser.json());
swaggerDoc(app);
app.use(cors());
const examRoutes = require("./routes/examRoutes");
//const classRoutes = require("./routes/classRoutes/classRoutes.js");
const morgan = require("morgan");
const eventRoutes = require("./routes/eventRoutes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes/ticketRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes/feedbackRoutes.js");
const reservationRoutes = require("./routes/reservationRoutes/reservationRoutes");

// ==============================================
app.use(corsMiddleware);

// SWAGGER docs
swaggerDoc(app);
app.use(morgan("dev"));
connect();

// Cors
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:3001,http://192.168.167.23:3001"
  );
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3001", "http://192.168.167.23:3001","https://elkindy-frontend.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/instruments", instrumentRouter);
app.use("/api/exchanges", exchangeRouter);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/feedbacks",feedbackRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/chat", messageRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/classes", classRoutes);
app.use(bodyParser.json());

// Increase the limit for EventEmitter instance
EventEmitter.defaultMaxListeners = 20;

// ==============================================
// START THE SERVER
// ==============================================

// if (process.env.NODE_ENV !== 'test') {
//   // Only start the server if not in test environment
//   app.listen(port, () => console.log(`Server running on port ${port}`));
//   io.listen(5000);
// }
const ip = "192.168.167.23";
server.listen(port);
io.listen(server);
console.log("Magic happens on port " + port);
//variable global pour socket partoutt
global.io=io;
module.exports = app;
