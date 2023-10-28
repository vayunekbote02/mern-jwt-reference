import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Create express server and mongodb database
const app = express();
connectDB();

// Configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.get("/", (req, res) => res.send("Server is up and running."));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Starting server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
