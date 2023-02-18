import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg";
import redis from "redis";

import keys from "./keys.js";

// Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const pgClient = new pg.Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("error", () => console.log("Lost Postgres connection"));

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// Redis client setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get("/", (_req, res) => {
  res.send("Hi");
});

// Retrieves all indices stored in DB
app.get("/values/all", async (_req, res) => {
  const values = await pgClient.query("Select * from values");
  res.send(values.rows);
});

// Retrieves all calculated values and indices from redis
app.get("/values/current", async (_req, res) => {
  redisClient.hgetall("values", (_err, values) => {
    res.send(values);
  });
});

// Retrieves new indices from the React FE
app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (_err) => {
  console.log("Listening");
});
