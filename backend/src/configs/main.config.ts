import dotenv from 'dotenv';

dotenv.config();

export const mainConfig = {
    PORT: process.env.PORT || 5500,

    PG_NAME_DATABASE: process.env.PG_NAME_DATABASE || 'postgres',
    PG_USER_NAME_DATABASE: process.env.PG_USER_NAME_DATABASE || 'postgres',
    PG_HOST_DATABASE: process.env.PG_HOST_DATABASE || 'localhost',
    PG_PORT_DATABASE: process.env.PG_PORT_DATABASE || 5432,
    PG_PASSWORD_DATABASE: process.env.PG_PASSWORD_DATABASE || 'postgres',
};
