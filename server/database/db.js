import mongoose from "mongoose";

export const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    dbName: "LibraryLink", //if error check this comma
  }).then(() => {
    console.log(`Database connected successfully.`);
  }).catch(err => {
    console.error(`Error connecting to database`, err);
  })
}

// if db doesn't work, check the following:
// add to mongodb_uri at .env file : at last - &w=majority&appName=Cluster0