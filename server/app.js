// const express = require("express"); // Import the express module

// another way
import express from "express"; // Import the express module
import { config } from "dotenv"; // Import the dotenv module to load environment variables
import cookieParser from "cookie-parser";
import cors from "cors"; // Import the cors module for Cross-Origin Resource Sharing

export const app = express(); // Create an instance of express and export it

config({ path: "./config/config.env" }); // Load environment variables from the .env file


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true // Allow credentials (cookies, authorization headers, etc.) to be sent
})); // Middleware to enable CORS for the specified frontend URL
app.use(cookieParser()); // Middleware to parse cookies from the request
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies