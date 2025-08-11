'use strict'

module.exports = async function (fastify, opts) {
  // 用户注册
  fastify.post('/register', {
    schema: {
      tags: ['认证'],
      summary: '用户注册',
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 20 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['user', 'chef'], default: 'user' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                token: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { username, email, password, role = 'user' } = request.body

      // 检查用户是否已存在
      const existingUser = await fastify.models.User.findOne({
        $or: [{ email }, { username }]
      })

      if (existingUser) {
        return reply.code(400).send({
          success: false,
          message: '用户名或邮箱已存在'
        })
      }

      // 创建新用户
      const hashedPassword = await fastify.bcrypt.hash(password)
      const user = new fastify.models.User({
        username,
        email,
        password: hashedPassword,
        role
      })

      await user.save()

      // 生成 JWT token
      const token = fastify.jwt.sign({ userId: user._id })

      // 返回用户信息（不包含密码）
      const userResponse = user.toObject()
      delete userResponse.password

      reply.send({
        success: true,
        message: '注册成功',
        data: {
          user: userResponse,
          token
        }
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '注册失败: ' + error.message
      })
    }
  })

  // 用户登录
  fastify.post('/login', {
    schema: {
      tags: ['认证'],
      summary: '用户登录',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { email, password } = request.body

      // 查找用户
      const user = await fastify.models.User.findOne({ email })
      if (!user) {
        return reply.code(401).send({
          success: false,
          message: '邮箱或密码错误'
        })
      }

      // 验证密码
      const isValidPassword = await fastify.bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return reply.code(401).send({
          success: false,
          message: '邮箱或密码错误'
        })
      }

      // 更新最后登录时间
      user.lastLoginAt = new Date()
      await user.save()

      // 生成 JWT token
      const token = fastify.jwt.sign({ userId: user._id })

      // 返回用户信息（不包含密码）
      const userResponse = user.toObject()
      delete userResponse.password

      reply.send({
        success: true,
        message: '登录成功',
        data: {
          user: userResponse,
          token
        }
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '登录失败: ' + error.message
      })
    }
  })

  // 获取当前用户信息
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['认证'],
      summary: '获取当前用户信息',
      security: [{ Bearer: [] }]
    }
  }, async function (request, reply) {
    reply.send({
      success: true,
      data: request.user
    })
  })
}