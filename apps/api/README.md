# 食物智能助手后端 API

一个基于 Fastify 的食物智能助手后端系统，提供食物扫描、餐谱管理、聊天群组和直播功能。

## Related frontend Project
Based on RN Framework [react_food_AI](https://github.com/BlackYHawk/react_food_AI)

## 功能特性

### 1. 食物扫描功能
- ✅ 保存APP提交的扫描食物历史记录
- ✅ 支持多种扫描方式（相机、条形码、手动输入）
- ✅ 详细的营养成分分析
- ✅ 营养统计和历史记录查询

### 2. 餐谱系统
- ✅ 日常食物餐谱大全
- ✅ 精选营养食物推荐
- ✅ 餐谱详情展示（食材、步骤、营养信息）
- ✅ 餐谱分类和搜索
- ✅ 收藏功能

### 3. 聊天群组功能
- ✅ 厨师与粉丝的聊天群后端
- ✅ 实时查看餐谱和评论
- ✅ WebSocket 实时通信
- ✅ 多种聊天室类型（餐谱讨论、厨师粉丝群等）

### 4. 直播功能（可扩展）
- ✅ 厨师直播间创建和管理
- ✅ 直播状态控制
- ✅ 直播聊天室集成
- 🔄 RTMP 流媒体支持（待完善）

## 技术栈

- **框架**: Fastify
- **数据库**: MongoDB + Mongoose
- **缓存**: Redis
- **认证**: JWT
- **实时通信**: WebSocket
- **API文档**: Swagger

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 环境配置
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

### 3. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 4. 访问API文档
打开浏览器访问: http://localhost:3000/docs

## API 接口

### 认证相关
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户信息

### 食物扫描
- `POST /food-scan/scan` - 保存扫描记录
- `GET /food-scan/history` - 获取扫描历史
- `GET /food-scan/nutrition-stats` - 获取营养统计

### 餐谱管理
- `GET /recipes` - 获取餐谱列表
- `GET /recipes/:id` - 获取餐谱详情
- `POST /recipes` - 创建餐谱（厨师专用）
- `GET /recipes/featured/recommendations` - 获取推荐餐谱
- `POST /recipes/:id/favorite` - 收藏/取消收藏

### 聊天功能
- `GET /chat/rooms` - 获取聊天室列表
- `POST /chat/rooms` - 创建聊天室
- `POST /chat/rooms/:roomId/join` - 加入聊天室
- `GET /chat/rooms/:roomId/messages` - 获取聊天消息
- `GET /chat/rooms/:roomId/ws` - WebSocket 连接

### 直播功能
- `POST /live-stream/streams` - 创建直播间
- `GET /live-stream/streams` - 获取直播列表
- `POST /live-stream/streams/:streamId/start` - 开始直播
- `POST /live-stream/streams/:streamId/end` - 结束直播

## 数据模型

### 用户模型 (User)
- 基本信息：用户名、邮箱、头像
- 角色：普通用户、厨师、管理员
- 个人资料：年龄、性别、健康目标等
- 偏好设置：菜系偏好、辣度等

### 食物扫描模型 (FoodScan)
- 食物信息：名称、分类、品牌
- 营养成分：卡路里、蛋白质、碳水等
- 扫描信息：方式、置信度、时间
- 用户备注和标签

### 餐谱模型 (Recipe)
- 基本信息：标题、描述、图片
- 分类信息：菜系、难度、用餐时间
- 制作信息：食材、步骤、设备
- 营养信息和饮食标签
- 统计数据：浏览量、点赞数等

### 聊天室模型 (ChatRoom)
- 房间信息：名称、描述、类型
- 成员管理：成员列表、角色权限
- 设置选项：最大人数、消息限制等

### 消息模型 (Message)
- 消息内容：文本、图片、餐谱分享
- 关联信息：发送者、回复消息
- 互动功能：表情反应、@提及

### 直播模型 (LiveStream)
- 直播信息：标题、描述、分类
- 技术参数：推流地址、播放地址
- 统计数据：观看人数、点赞数
- 状态管理：创建、进行中、结束

## 部署说明

### 环境要求
- Node.js >= 18
- MongoDB >= 4.4
- Redis >= 6.0

### 生产部署
1. 设置环境变量
2. 配置反向代理（Nginx）
3. 使用 PM2 进程管理
4. 配置 SSL 证书

## 开发计划

- [ ] 文件上传功能
- [ ] 推送通知系统
- [ ] 数据分析和报表
- [ ] 管理后台界面
- [ ] 移动端适配优化
- [ ] 性能监控和日志系统

## 许可证

MIT License