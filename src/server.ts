import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "./app";

const server = http.createServer(app);
