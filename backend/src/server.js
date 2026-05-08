process.env.TZ = 'Asia/Ho_Chi_Minh';
import express from 'express';
import bodyParser from 'body-parser';
import initWebRoutes from './route/web.js';
import connectDB from './config/connectDB.js';
import 'dotenv/config';
import cors from 'cors';
import { startAutoCancelCron } from './services/cronService.js';
import { apiLimiter } from './middleware/rateLimit.js';
import logger from './utils/logger.js';

startAutoCancelCron();

let app = express();

// Trust the first proxy (Azure VM behind Nginx / load balancer) so that
// rate limiters can read the real client IP from X-Forwarded-For.
app.set('trust proxy', 1);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'https://health-connect-sooty-omega.vercel.app',
        'https://healthconnect.io.vn',
        'http://localhost:3000',
        'http://localhost:5173',
    ],
    credentials: true,
}));

// Generic API limiter applied to every /api/* route. Auth routes get a
// stricter limiter layered on top inside web.js.
app.use('/api', apiLimiter);

initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => { logger.info({ port }, 'Server started'); });
