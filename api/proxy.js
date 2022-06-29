// Vercel 跨域处理
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = "";

  // 代理目标地址
  if (req.url.startsWith("/dev-api")) {
    target = "http://gmall-h5-api.atguigu.cn";
  }

  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { "^/dev-api": "" },
  })(req, res);
};
