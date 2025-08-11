'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
const options = {}

module.exports = async function (fastify, opts) {
  // 注册 Swagger 文档
  await fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: '食物智能助手 API',
        description: '提供食物扫描、餐谱推荐、聊天群等功能的后端服务',
        version: '1.0.0'
      },
      host: 'localhost:3000',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  })

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  })

  // 数据库连接
  await fastify.register(require('./plugins/database'))

  // Redis 连接
  await fastify.register(require('./plugins/redis'))

  // JWT 认证
  await fastify.register(require('./plugins/auth'))

  // WebSocket 支持 (用于聊天功能)
  await fastify.register(require('./plugins/websocket'))

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}

module.exports.options = options
