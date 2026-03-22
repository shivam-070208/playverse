export const PORT = Number(process.env.PORT || 3002);
export const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(',') || [];
export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
export const REDIS_URL = process.env.REDIS_URL;
