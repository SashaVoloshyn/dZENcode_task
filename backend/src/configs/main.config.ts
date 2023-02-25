import dotenv from 'dotenv';

dotenv.config();

export const mainConfig = {
    PORT: process.env.PORT || 5500,

    PG_NAME_DATABASE: process.env.PG_NAME_DATABASE || 'postgres',
    PG_USER_NAME_DATABASE: process.env.PG_USER_NAME_DATABASE || 'postgres',
    PG_HOST_DATABASE: process.env.PG_HOST_DATABASE || 'localhost',
    PG_PORT_DATABASE: process.env.PG_PORT_DATABASE || 5432,
    PG_PASSWORD_DATABASE: process.env.PG_PASSWORD_DATABASE || 'postgres',

    PASSWORD_SALT_ROUNDS: process.env.PASSWORD_SALT_ROUNDS || 7,

    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY || 'secret_access',
    SECRET_REFRESH_KEY: process.env.SECRET_REFRESH_KEY || 'secret_refresh',

    EXPIRES_IN_ACCESS: process.env.EXPIRES_IN_ACCESS || '1h',
    EXPIRES_IN_REFRESH: process.env.EXPIRES_IN_REFRESH || '8h',

    EXPIRES_CLIENT_TOKENS_PAIR: process.env.EXPIRES_CLIENT_TOKENS_PAIR || '3600',

    S3_NAME: process.env.S3_NAME,
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    CLOUD_DOMAIN_NAME: process.env.CLOUD_DOMAIN_NAME,
};
