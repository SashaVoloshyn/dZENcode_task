import express from 'express';
import cors from 'cors';

import helmet from 'helmet';
import { AppDataSource, mainConfig } from './configs';
import { apiRouter } from './routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(apiRouter);

const { PORT } = mainConfig;

app.listen(PORT, async () => {
    console.log(`Server is running on port : ${PORT}`);
    try {
        const connection = await AppDataSource.initialize();
        if (connection) console.log('DATABASE has been connected');
    } catch (e) {
        console.log('Error connection to DATABASE', e);
    }
});
