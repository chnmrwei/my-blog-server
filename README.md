# 博客系统后端项目说明

## 环境配置

### MongoDB 安装与配置（Windows）
1. 下载 MongoDB
   - 访问 [MongoDB 官网](https://www.mongodb.com/try/download/community)
   - 选择 Community Server
   - 下载 Windows 版本的 .msi 安装包

2. 安装步骤
   - 运行 .msi 安装包
   - 选择 "Complete" 安装
   - 可选安装 MongoDB Compass（图形界面工具）

3. 配置环境变量
   - 添加 MongoDB bin 目录到系统 Path
   - 默认路径：`C:\Program Files\MongoDB\Server\{version}\bin`

4. 创建数据目录
```bash
mkdir C:\data\db
```

5. 启动 MongoDB
```bash
# 方式1：命令行启动
mongod --dbpath C:\data\db

# 方式2：Windows 服务启动
mongod

# 连接测试
mongosh
```

6. 数据库初始化
```bash
# 创建管理员用户
use admin
db.createUser({
  user: "admin",
  pwd: "password",
  roles: ["root"]
})
```

### Node.js 环境
1. 下载安装 Node.js
   - 访问 [Node.js 官网](https://nodejs.org/)
   - 下载 LTS 版本（推荐）
   - 安装时勾选自动配置环境变量

2. 验证安装
```bash
node -v
npm -v
```

## 项目配置

### 环境要求
- Node.js >= 14
- MongoDB >= 4.0

### 本地开发
```bash
# 克隆项目
git clone https://github.com/chnmrwei/my-blog-server.git

# 安装依赖
npm install

# 配置环境变量（创建 .env 文件）
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog
JWT_SECRET=your_jwt_secret

# 启动开发服务器
npm run dev
```

## 项目介绍

### 技术栈
- **核心框架：** Node.js + Express.js
- **数据库：** MongoDB + Mongoose
- **认证：** JWT
- **文档：** Swagger
- **日志：** Winston

### 项目结构
```plaintext
blog-server/
├── config/          # 配置文件
├── controllers/     # 控制器
├── models/         # 数据模型
├── routes/         # 路由配置
├── middleware/     # 中间件
├── services/       # 业务逻辑
├── uploads/        # 文件上传
├── logs/           # 日志文件
└── scripts/        # 脚本文件
```

### 核心功能
1. 用户系统
   - 登录注册
   - JWT 认证
   - 权限控制

2. 文章管理
   - 发布文章
   - 文章列表
   - 文章详情

3. 评论系统
   - 发表评论
   - 评论列表
   - 回复功能

## API 文档
- 本地访问：`http://localhost:5000/api-docs`
- 使用 Swagger UI 查看完整 API 文档

## 常见问题
1. MongoDB 连接失败
   - 检查 MongoDB 服务是否启动
   - 验证连接字符串是否正确
   - 确认防火墙设置

2. 权限问题
   - 确认数据库用户权限配置
   - 检查文件上传目录权限

## 部署说明
1. 安装依赖：`npm install --production`
2. 配置环境变量
3. 启动服务：`npm start`

