export default () => ({
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27019/urbanTasker',
});
