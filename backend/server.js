const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoDBUrl = process.env.MONGODB_URL;
const port = process.env.PORT || 5000;

mongoose
  .connect(mongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
  });

app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
