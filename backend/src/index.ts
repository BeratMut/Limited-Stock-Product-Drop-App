import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import observabilityRoutes from './routes/observability.js';
import { startReservationCleanupJob } from './cron/reservationCleanup.js';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/', observabilityRoutes);

app.use('/api', routes);


app.use(errorHandler);


startReservationCleanupJob();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
