import express from "express";
import dotenv from "dotenv";
import redis from "redis";
import { connectToMongoDB } from "./db/config.js";
dotenv.config();

const PORT = process.env.PORT;

const app = express();

const client = redis.createClient();

client.connect();

client.on("connect", () => {
  console.log("Connected to RedisDB!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  connectToMongoDB();
  console.log("Server is running!"); 
});
