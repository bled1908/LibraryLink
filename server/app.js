// const express = require("express"); // Import the express module

// another way
import express from "express"; // Import the express module
import { config } from "dotenv"; // Import the dotenv module to load environment variables
import cookieParser from "cookie-parser";
import cors from "cors"; // Import the cors module for Cross-Origin Resource Sharing
import { connectDB } from "./database/db.js"; // Import the connectDB function to connect to the database
import { errorMiddleware } from "./middlewares/errorMiddlewares.js"; // Import the error middleware for handling errors
import authRouter from "./routes/authRouter.js"; // Import the authentication routes
import bookRouter from "./routes/bookRouter.js"; // Import the book routes

export const app = express(); // Create an instance of express and export it

config({ path: "./config/config.env" }); // Load environment variables from the .env file


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true // Allow credentials (cookies, authorization headers, etc.) to be sent
})
); // Middleware to enable CORS for the specified frontend URL
app.use(cookieParser()); // Middleware to parse cookies from the request
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

app.use("/api/v1/auth", authRouter); // Use the authentication routes for requests to /api/v1/auth
// http://localhost:4000/api/v1/auth/ - This is the base URL for authentication routes
app.use("/api/v1/book", bookRouter);
// Connect to the database
connectDB();


app.use(errorMiddleware); // Use the error middleware to handle errors globally