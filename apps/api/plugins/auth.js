'use strict'

const fp = require('fastify-plugin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function auth(fastify, options) {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

  // JWT 工具函数
  fastify.decorate('jwt', {
    sign: (payload) => {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
    },
    verify: (token) => {
      return jwt.verify(token, JWT_SECRET)
    }
  })

  // 密码加密工具
  fastify.decorate('bcrypt', {
    hash: async (password) => {
      return await bcrypt.hash(password, 10)
    },
    compare: async (password, hash) => {
      return await bcrypt.compare(password, hash)
    }
  })

  // 认证中间件
  fastify.decorate('authenticate', async function(request, reply) {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        throw new Error('未提供认证令牌')
      }

      const decoded = fastify.jwt.verify(token)
      const user = await fastify.models.User.findById(decoded.userId).select('-password')
      
      if (!user) {
        throw new Error('用户不存在')
      }

      request.user = user
    } catch (error) {
      reply.code(401).send({
        success: false,
        message: '认证失败: ' + error.message
      })
    }
  })

  // 可选认证中间件
  fastify.decorate('optionalAuth', async function(request, reply) {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '')
      
      if (token) {
        const decoded = fastify.jwt.verify(token)
        const user = await fastify.models.User.findById(decoded.userId).select('-password')
        request.user = user
      }
    } catch (error) {
      // 可选认证失败时不抛出错误
      fastify.log.warn('可选认证失败:', error.message)
    }
  })
}

module.exports = fp(auth)