const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(createProxyMiddleware('/bestatus',{changeOrigin : true,target : 'http://nagp-ilcntrl-status-srvs-nagp-infohub-tst-01.apps.test-b.0001.o2.wu2.csl.cd2.bp.com'}));
    app.use(createProxyMiddleware('/publishstatus',{changeOrigin : true,target : 'http://nagp-ilcntrl-status-srvs-nagp-infohub-tst-01.apps.test-b.0001.o2.wu2.csl.cd2.bp.com'}));
    app.use(createProxyMiddleware('/targetstatus',{changeOrigin : true,target : 'http://nagp-ilcntrl-status-srvs-nagp-infohub-tst-01.apps.test-b.0001.o2.wu2.csl.cd2.bp.com'}));
    app.use(createProxyMiddleware('/pubsubstatus',{changeOrigin : true,target : 'http://nagp-ilcntrl-status-srvs-nagp-infohub-tst-01.apps.test-b.0001.o2.wu2.csl.cd2.bp.com'}));
    app.use(createProxyMiddleware('/api',{headers : {Connection: "keep-alive"},changeOrigin : true,target : 'http://test-republish-nagp-infohub-int-01.apps.test-b.0001.o2.wu2.csl.cd2.bp.com'}));
}