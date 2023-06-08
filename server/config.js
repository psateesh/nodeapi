
module.exports = {
  DOMAIN: process.env.DOMAIN,
  CCB_API_URL: process.env.CCB_API_URL,
  BASE_PATH: process.env.BASE_PATH,
  isEncryption: process.env.NODE_ENV == 'production',
  SESS_NAME: process.env.SESS_NAME,
  SESS_SECRET: process.env.SESS_SECRET,
  SESS_LIFETIME: parseInt(process.env.SESS_LIFETIME, 10),
  MSSQL_HOST: process.env.MSSQL_HOST,
  MSSQL_USERNAME: process.env.MSSQL_USERNAME,
  MSSQL_PASSWORD: process.env.MSSQL_PASSWORD,
  MSSQL_DATABASE: process.env.MSSQL_DATABASE,
  MSSQL_ENV: process.env.MSSQL_ENV,
  ENABLE_CSRF: process.env.ENABLE_CSRF,
};

