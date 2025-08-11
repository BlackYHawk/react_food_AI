'use strict'
const fs = require('fs').promises
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Redis = require('ioredis')
const redis = new Redis()

// 用户模型
const userSchema = new mongoose.Schema({
  username: String,
  password: String
})
const User = mongoose.model('User', userSchema)

// 连接数据库
mongoose.connect('mongodb://localhost:27017/fastify_food')

// JWT 鉴权中间件
async function verifyJWT(request, reply) {
  try {
    const auth = request.headers.authorization
    if (!auth) throw new Error('缺少 token')
    const token = auth.replace('Bearer ', '')
    const decoded = jwt.verify(token, 'your_jwt_secret')
    request.user = decoded
  } catch (err) {
    return reply.code(401).send({ error: '未授权' })
  }
}

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })

  // 注册接口
  fastify.post('/api/register', async (request, reply) => {
    const { username, password } = request.body
    const exist = await User.findOne({ username })
    if (exist) return reply.code(400).send({ error: '用户已存在' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hash })
    reply.send({ id: user._id, username: user.username })
  })
  
  // 登录接口
  fastify.post('/api/login', async (request, reply) => {
    const { username, password } = request.body
    // 先查缓存
    let user = await redis.get(`user:${username}`)
    if (user) {
      user = JSON.parse(user)
    } else {
      user = await User.findOne({ username })
      if (!user) return reply.code(400).send({ error: '用户不存在' })
      // 缓存到 redis
      await redis.set(`user:${username}`, JSON.stringify(user), 'EX', 3600)
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return reply.code(400).send({ error: '密码错误' })
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' })
    reply.send({ token })
  })

  // 新增：返回 food 文件夹下所有 json 文件内容
  fastify.get('/api/food/:filename', { }, async function (request, reply) {
    const filename = request.params.filename
    const filePath = path.join(__dirname, '.', 'food', `${filename}.json`)
    try {
      const data = await fs.readFile(filePath, 'utf-8')
      reply.type('application/json').send(data)
    } catch (err) {
      reply.code(404).send({ error: 'File not found' })
    }
  })
}
