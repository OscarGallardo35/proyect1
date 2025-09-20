import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 4000),
  dropshipping: {
    autoFulfill: process.env.DROPSHIPPING_AUTO === 'true',
    defaultPrepTime: Number(process.env.DROPSHIPPING_PREP || 2)
  }
};
