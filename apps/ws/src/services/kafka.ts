import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ws-server',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  logLevel: logLevel.ERROR,
});

const kafkaProducer = kafka.producer();

export async function initializeKafka() {
  try {
    await kafkaProducer.connect();
    console.log('Kafka producer connected');
  } catch (error) {
    console.error('Kafka connection error:', error);
    throw error;
  }
}

export async function disconnectKafka() {
  try {
    await kafkaProducer.disconnect();
    console.log('Kafka producer disconnected');
  } catch (error) {
    console.error('Kafka disconnection error:', error);
  }
}

export { kafkaProducer };
