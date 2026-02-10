import { Kafka } from 'kafkajs';
import { config } from 'dotenv';

config();

const kafka = new Kafka({
  clientId: 'aurum-pulse',
  brokers: [process.env.KAFKA_BROKER_URL],
});

export default kafka.producer();
