# OAuth2.0 社交登录全栈应用

基于 Next.js + Express + Passport.js + MongoDB 的 OAuth2.0 社交登录全栈应用，支持 GitHub 和 Google 账号登录。

## 功能特性

- ✅ GitHub OAuth2.0 登录
- ✅ Google OAuth2.0 登录
- ✅ JWT 令牌认证（访问令牌 + 刷新令牌）
- ✅ 自动令牌刷新机制
- ✅ 用户资料编辑
- ✅ 会话管理
- ✅ MongoDB 数据持久化

## 技术栈

### 前端
- **Next.js 14** - React 服务端渲染框架
- **React 18** - UI 库
- **Axios** - HTTP 客户端
- **js-cookie** - Cookie 管理

### 后端
- **Express.js** - Node.js Web 框架
- **Passport.js** - 认证中间件
- **Mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT 令牌生成与验证
- **CORS** - 跨域资源共享

## 项目结构

```
auto15/
├── client/                 # Next.js 前端
│   ├── pages/
│   │   ├── login.js       # 登录页面
│   │   ├── profile.js     # 用户资料页面
│   │   └── auth/
│   │       └── callback.js # OAuth 回调页面
│   ├── contexts/
│   │   └── AuthContext.js # 认证上下文
│   ├── utils/
│   │   └── api.js         # API 配置与拦截器
│   └── styles/
│       └── globals.css    # 全局样式
├── server/                 # Express 后端
│   ├── config/
│   │   └── passport.js    # Passport.js 配置
│   ├── middleware/
│   │   └── auth.js        # 认证中间件
│   ├── models/
│   │   └── User.js        # 用户模型
│   ├── routes/
│   │   └── auth.js        # 认证路由
│   ├── utils/
│   │   └── jwt.js         # JWT 工具函数
│   ├── server.js          # 服务器入口
│   └── .env.example       # 环境变量示例
└── README.md
```

## 快速开始

### 前置要求

- Node.js 16+
- MongoDB 4.4+
- GitHub OAuth 应用凭证
- Google OAuth 应用凭证

### 1. 获取 OAuth 凭证

#### GitHub OAuth 应用
1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息：
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`

#### Google OAuth 应用
1. 访问 https://console.cloud.google.com/
2. 创建新项目
3. 启用 "Google+ API"
4. 创建 OAuth 2.0 客户端 ID
5. 授权重定向 URI: `http://localhost:5000/api/auth/google/callback`

### 2. 配置环境变量

```bash
cd server
cp .env.example .env
```

编辑 `.env` 文件，填入你的凭证：

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/oauth2-demo

JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

CLIENT_URL=http://localhost:3000
```

### 3. 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 4. 启动应用

```bash
# 启动后端服务 (端口 5000)
cd server
npm run dev

# 启动前端服务 (端口 3000)
cd client
npm run dev
```

### 5. 访问应用

打开浏览器访问: http://localhost:3000/login

## API 端点

### 认证相关

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/auth/github` | GitHub 登录重定向 |
| GET | `/api/auth/github/callback` | GitHub OAuth 回调 |
| GET | `/api/auth/google` | Google 登录重定向 |
| GET | `/api/auth/google/callback` | Google OAuth 回调 |
| POST | `/api/auth/refresh` | 刷新访问令牌 |
| GET | `/api/auth/me` | 获取当前用户信息 (需要认证) |
| PUT | `/api/auth/profile` | 更新用户资料 (需要认证) |

### 其他

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/health` | 健康检查 |

## 令牌机制

### 访问令牌 (Access Token)
- 有效期: 15 分钟
- 存储: HttpOnly Cookie / localStorage
- 用途: API 请求认证

### 刷新令牌 (Refresh Token)
- 有效期: 7 天
- 存储: 安全 Cookie
- 用途: 获取新的访问令牌

### 自动刷新流程
1. 前端请求时携带访问令牌
2. 令牌过期返回 401
3. Axios 拦截器自动使用刷新令牌获取新令牌
4. 重试原请求
5. 刷新令牌过期则跳转登录页

## 安全措施

- JWT 签名验证
- CORS 配置限制来源
- 密码学安全的令牌生成
- 敏感信息不暴露给前端
- Token 自动过期机制

## 开发说明

### 添加新的 OAuth 提供商

1. 在 `server/config/passport.js` 中添加新策略
2. 在 `server/routes/auth.js` 中添加对应路由
3. 在 `client/pages/login.js` 中添加登录按钮
4. 更新 `server/.env` 添加新的环境变量

### 自定义用户模型

编辑 `server/models/User.js` 添加所需字段。

## License

MIT
