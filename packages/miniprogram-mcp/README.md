# 小程序MCP - 获取发布/放量进度

## 项目介绍

本项目实现了通过微信小程序开放平台API获取小程序分阶段发布详情的功能，帮助开发者监控小程序的发布和放量进度。

## 技术栈

- Node.js
- Express
- Axios

## 项目结构

```
miniprogram-mcp/
├── package.json        # 项目配置和依赖
├── index.js            # 主实现文件
└── README.md           # 项目说明
```

## 安装依赖

```bash
npm install
```

## 配置修改

在 `index.js` 文件中，需要修改以下配置信息：

```javascript
const config = {
  appid: 'YOUR_APPID', // 替换为你的小程序AppID
  secret: 'YOUR_SECRET', // 替换为你的小程序AppSecret
  openPlatformAppid: 'YOUR_OPEN_PLATFORM_APPID', // 替换为你的开放平台AppID
  openPlatformSecret: 'YOUR_OPEN_PLATFORM_SECRET' // 替换为你的开放平台AppSecret
};
```

## API授权说明

### 1. 授权路径

获取小程序分阶段发布详情需要以下授权步骤：

1. **获取小程序访问令牌（access_token）**
   - 接口：`https://api.weixin.qq.com/cgi-bin/token`
   - 参数：appid, secret, grant_type=client_credential
   - 说明：用于调用小程序相关API

2. **获取开放平台访问令牌（component_access_token）**（可选，仅当使用开放平台时需要）
   - 接口：`https://api.weixin.qq.com/cgi-bin/component/api_component_token`
   - 参数：component_appid, component_appsecret, component_verify_ticket
   - 说明：用于代小程序调用API

### 2. 是否必须服务端调用

**是的，必须在服务端调用**，原因如下：

1. **安全考虑**：AppSecret 是敏感信息，不能在客户端暴露
2. **权限限制**：微信API大多数接口都要求在服务端调用
3. **访问令牌管理**：需要维护access_token的有效期和刷新机制

## 使用方法

### 启动服务

```bash
npm start
```

### 调用API

发送GET请求到：

```
http://localhost:3000/api/gray-release-plan?appid=YOUR_APPID
```

### 响应示例

```json
{
  "errcode": 0,
  "errmsg": "ok",
  "gray_release_plan": {
    "plan_id": "123456",
    "status": 1, // 1: 灰度中, 2: 灰度完成, 3: 灰度失败
    "create_time": 1630000000,
    "gray_percent": 30, // 当前灰度比例
    "total_percent": 100, // 目标灰度比例
    "release_time": 1630000000, // 发布时间
    "stage_list": [
      {
        "percent": 10,
        "start_time": 1630000000,
        "end_time": 1630000000
      },
      {
        "percent": 30,
        "start_time": 1630000000,
        "end_time": 1630000000
      },
      {
        "percent": 100,
        "start_time": 1630000000,
        "end_time": 1630000000
      }
    ]
  }
}
```

## API文档

### getGrayReleasePlan

**接口地址**：`https://api.weixin.qq.com/wxa/grayreleaseplan/get`

**请求方法**：POST

**请求参数**：
- access_token：访问令牌
- appid：小程序AppID

**返回结果**：
- errcode：错误码，0表示成功
- errmsg：错误信息
- gray_release_plan：分阶段发布详情

## 注意事项

1. **AppID和AppSecret的安全**：不要将这些信息提交到版本控制系统
2. **访问令牌的有效期**：access_token有效期为2小时，需要定期刷新
3. **API调用频率限制**：微信API有调用频率限制，请注意控制调用次数
4. **错误处理**：需要妥善处理API调用失败的情况

## 扩展功能

可以根据需要扩展以下功能：

1. **自动刷新access_token**：实现access_token的自动刷新机制
2. **多小程序管理**：支持管理多个小程序的发布进度
3. **数据存储**：将发布进度数据存储到数据库，以便历史查询
4. **监控告警**：当发布进度异常时发送告警通知

## 相关文档

- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/)
- [微信开放平台文档](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1489140610_Uavc4&token=&lang=zh_CN)