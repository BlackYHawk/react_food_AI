'use strict'

const fp = require('fastify-plugin')
const Redis = require('ioredis')

async function redis(fastify, options) {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:16379'
    
    const redis = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    })

    redis.on('connect', () => {
      fastify.log.info('Redis 连接成功')
    })

    redis.on('error', (error) => {
      fastify.log.error('Redis 连接错误:', error)
    })

    fastify.decorate('redis', redis)

    // 优雅关闭
    fastify.addHook('onClose', async () => {
      await redis.quit()
      fastify.log.info('Redis 连接已关闭')
    })

  } catch (error) {
    fastify.log.error('Redis 初始化失败:', error)
    throw error
  }
}

module.exports = fp(redis)