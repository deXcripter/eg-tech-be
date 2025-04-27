import http from "http";
import dotenv from "dotenv";

// configure the dotenv package
dotenv.config();

import app from "./app";
import connectDb from "./config/connect-db";

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
  connectDb()
    .then((res) => console.log(res))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
});
