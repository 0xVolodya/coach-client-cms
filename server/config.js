const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://user:user@ds111410.mlab.com:11410/coach-client',
  port: process.env.PORT || 8000,
};

export default config;
