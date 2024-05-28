const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const admin = require("./firebase");
const User = require("./models/User");
const cors = require("cors");

const dotenv = require("dotenv");
require("dotenv/config");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
}

app.post("/api/protected", verifyToken, async (req, res) => {
  const { uid, name, email, picture } = req.user;

  let user = await User.findOne({ uid });

  if (!user) {
    user = new User({ uid, name, email, picture });
    await user.save();
  }

  res.send(user);
});

app.listen(3001, () => {
  console.log("Server is running is up and running on port 3001");
});
