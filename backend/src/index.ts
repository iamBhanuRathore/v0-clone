require("dotenv").config();
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
  return;
});

app.listen(8080, () => {
  console.log("Server is running");
});
