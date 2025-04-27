import mongoose from "mongoose";

export default (): Promise<string> => {
  console.log("Connecting to MongoDB...");
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URI as string)
      .then((conn) => {
        resolve(`MongoDB connected: ${conn.connection.host}`);
      })
      .catch((err) => {
        reject(`MongoDB connection error: ${err}`);
      });
  });
};
