import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { dbConnection } from "./config/database.js";
import userRouter from "./routes/userRoutes.js";
import substituteRouter from "./routes/substituteRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la bdd
mongoose
  .connect(dbConnection.url, dbConnection.options)
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Initialisation des routes
app.get("/", (req, res) => {
  res.send("Server is ready");
});
app.use("/api/user", userRouter);
app.use("/api/substitute", substituteRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Lancement du server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Serve at port ${port}`);
});
