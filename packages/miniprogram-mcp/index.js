const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// 配置信息
const config = {
  appid: 'wxcfa34e684de936f5', // 你的小程序AppID
  secret: 'c5e749f03b5d22c746dae3568207f6d4', // 你的小程序AppSecret
  openPlatformAppid: 'YOUR_OPEN_PLATFORM_APPID', // 你的开放平台AppID
  openPlatformSecret: 'YOUR_OPEN_PLATFORM_SECRET' // 你的开放平台AppSecret
};

// 获取访问令牌
async function getAccessToken() {
  try {
    const response = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`
    );
    return response.data.access_token;
  } catch (error) {
    console.error('获取访问令牌失败:', error);
    throw error;
  }
}

// // 获取开放平台访问令牌
// async function getOpenPlatformAccessToken() {
//   try {
//     const response = await axios.get(
//       `https://api.weixin.qq.com/cgi-bin/component/api_component_token`,
//       {
//         params: {
//           component_appid: config.openPlatformAppid,
//           component_appsecret: config.openPlatformSecret,
//           component_verify_ticket: 'YOUR_VERIFY_TICKET' // 需要从微信推送中获取
//         }
//       }
//     );
//     return response.data.component_access_token;
//   } catch (error) {
//     console.error('获取开放平台访问令牌失败:', error);
//     throw error;
//   }
// }

// 获取分阶段发布详情
async function getGrayReleasePlan(accessToken, appid) {
  try {
    const response = await axios.get(
      `https://api.weixin.qq.com/wxa/getgrayreleaseplan?access_token=${accessToken}`,
    );
    return response.data;
  } catch (error) {
    console.error('获取分阶段发布详情失败:', error);
    throw error;
  }
}

// API路由
app.get('/api/gray-release-plan', async (req, res) => {
  try {
    const { appid } = req.query;
    if (!appid) {
      return res.status(400).json({ error: '缺少appid参数' });
    }
    
    const accessToken = await getAccessToken();
    const result = await getGrayReleasePlan(accessToken, appid);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: '获取分阶段发布详情失败' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
  console.log('API接口: GET /api/gray-release-plan?appid=YOUR_APPID');
});

module.exports = app;