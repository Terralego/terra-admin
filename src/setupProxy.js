// eslint-disable-next-line import/no-extraneous-dependencies
const proxy = require('http-proxy-middleware');

module.exports = app => {
  const API_HOST = process.env.REACT_APP_API_HOST;
  if (API_HOST === undefined) {
    // eslint-disable-next-line no-console
    console.error('You must set your REACT_APP_API_HOST in your .env file');
  }
  app.use(proxy(['/api', '/static_dj', '/media'], { target: API_HOST, changeOrigin: true }));
};
