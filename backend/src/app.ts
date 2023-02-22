import express from 'express';

import { AppDataSource, mainConfig } from './configs';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
