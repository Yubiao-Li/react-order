const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://121.37.2.73:3000',
      pathRewrite: {
        '^/api': '',
      },
      changeOrigin: true,
    })
  );
};
