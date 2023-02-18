import keys from "./keys.js";
import redis from "redis";

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const subscription = redisClient.duplicate();

/* 
Use recursion as it will be slow! Gives a better
excuse to use redis with a separate worker process
 */
const calcFibonacci = (index) =>
  index < 2 ? 1 : calcFibonacci(index - 1) + calcFibonacci(index - 2);

subscription.on("message", (channel, message) => {
  redisClient.hset("values", message, calcFibonacci(parseInt(message)));
});
subscription.subscribe("insert");
