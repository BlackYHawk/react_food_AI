'use strict'

const fp = require('fastify-plugin')
const mongoose = require('mongoose')

async function database(fastify, options) {
  try {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/food_assistant'
    
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    fastify.log.info('MongoDB 连接成功')

    // 注册数据模型
    const User = require('../models/User')
    const FoodScan = require('../models/FoodScan')
    const Recipe = require('../models/Recipe')
    const ChatRoom = require('../models/ChatRoom')
    const Message = require('../models/Message')
    const LiveStream = require('../models/LiveStream')

    fastify.decorate('models', {
      User,
      FoodScan,
      Recipe,
      ChatRoom,
      Message,
      LiveStream
    })

    // 优雅关闭
    fastify.addHook('onClose', async () => {
      await mongoose.connection.close()
      fastify.log.info('MongoDB 连接已关闭')
    })

  } catch (error) {
    fastify.log.error('MongoDB 连接失败:', error)
    throw error
  }
}

module.exports = fp(database)