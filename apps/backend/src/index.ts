import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '@workspace/auth';
import { ALLLOWED_ORIGINS, PORT } from './configuration/env.configuration';
// Variable declaration
const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// apis
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
