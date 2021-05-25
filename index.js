import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// import localFiles
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting Routes
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);

app.get("/", (req, res) => {
  res.send("Sever is running");
});

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL || "mongodb://localhost/doraContact", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(port, () => {
      console.log(`Sever is running on port ${port}`);
    })
  )
  .catch((e) => console.log(e));
