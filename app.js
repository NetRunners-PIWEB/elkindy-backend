// BASE SETUP
// ==============================================
var express = require("express");
var app = express();
var { connect } = require("./config/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require('./routes/courseRoutes/courseRoutes');


const authRoutes = require("./routes/authRoutes");
const { userVerification } = require("./middlewares/authJWT");
// ==============================================


connect();
/*app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    }));*/
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    swaggerDoc(app);
    app.use(cookieParser());
    app.use(cors());

app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use(bodyParser.json());
app.get('/api/validate-session', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Optionally, fetch user details from your database and return them
    return res.status(200).json({ user: decoded });
  });
});
// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log("Magic happens on port " + port);
