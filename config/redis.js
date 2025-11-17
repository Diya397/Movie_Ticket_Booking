const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL
});

const subscriber = redis.createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

subscriber.on('error', (err) => {
  console.error('Redis Subscriber Error:', err);
});

client.on('connect', () => {
  console.log('Movie Service Redis connected');
});

subscriber.on('connect', () => {
  console.log('Movie Service Redis Subscriber connected');
});

const connectRedis = async () => {
  await client.connect();
  await subscriber.connect();
};

module.exports = { client, subscriber, connectRedis };