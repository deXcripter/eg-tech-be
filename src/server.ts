import http from "http";
import dotenv from "dotenv";

// configure the dotenv package
dotenv.config();

import app from "./app";
import connectDb from "./config/connect-db";
import { setSiteState } from "./controllers/site.settings.controller";

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
  connectDb()
    .then(async (res) => {
      await setSiteState();
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
});

process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection: ${err}`);
});
