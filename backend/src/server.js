process.env.TZ = 'Asia/Ho_Chi_Minh';
import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './config/viewEngine.js';
import initWebRoutes from './route/web.js';
import connectDB from './config/connectDB.js';
import 'dotenv/config';
import cors from 'cors';
import { startAutoCancelCron } from './services/cronService.js';

startAutoCancelCron();


let app = express();
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

configViewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8080;
app.listen(port, () => {console.log(`Server is running on port ${port}`)});
