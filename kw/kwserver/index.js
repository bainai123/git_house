const express = require('express');
const hpm = require('http-proxy-middleware')
const app = express();

const proxy = hpm.createProxyMiddleware({
    target: 'http://www.kuwo.cn',
    changeOrigin: true,
    onProxyRes (res) {
        res.headers['access-control-allow-origin'] = '*';
    },
    onProxyReq (req) {
        req.setHeader('Cookie', 'kw_token=AQVSV8JK89')
        req.setHeader('csrf', 'AQVSV8JK89')
    }
})
app.use(proxy)

app.listen(3000, () => {
    console.log('启动成功');
})