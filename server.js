const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const PORT = process.env.PORT || 8000;
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to blog App" });
});

app.use("/api/users", require("./routes/userRoutes"));

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
