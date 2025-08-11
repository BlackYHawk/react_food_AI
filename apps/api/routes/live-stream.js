'use strict'

module.exports = async function (fastify, opts) {
  // 创建直播间
  fastify.post('/streams', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['直播'],
      summary: '创建直播间',
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          thumbnail: { type: 'string' },
          category: { type: 'string', enum: ['cooking', 'baking', 'tutorial', 'chat'] },
          isPrivate: { type: 'boolean', default: false },
          maxViewers: { type: 'integer', minimum: 1, maximum: 10000, default: 1000 },
          scheduledAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      // 检查用户是否为厨师
      if (request.user.role !== 'chef' && request.user.role !== 'admin') {
        return reply.code(403).send({
          success: false,
          message: '只有厨师可以创建直播间'
        })
      }

      // 检查是否已有进行中的直播
      const existingStream = await fastify.models.LiveStream.findOne({
        chefId: request.user._id,
        status: { $in: ['scheduled', 'live'] }
      })

      if (existingStream) {
        return reply.code(400).send({
          success: false,
          message: '您已有进行中或计划中的直播'
        })
      }

      const streamData = {
        ...request.body,
        chefId: request.user._id,
        status: request.body.scheduledAt ? 'scheduled' : 'created',
        streamKey: generateStreamKey(),
        rtmpUrl: `rtmp://localhost:1935/live/${generateStreamKey()}`
      }

      const stream = new fastify.models.LiveStream(streamData)
      await stream.save()

      // 创建对应的聊天室
      const chatRoom = new fastify.models.ChatRoom({
        name: `${request.body.title} - 直播聊天室`,
        type: 'live_stream',
        chefId: request.user._id,
        createdBy: request.user._id,
        members: [{
          userId: request.user._id,
          role: 'admin',
          joinedAt: new Date()
        }]
      })
      await chatRoom.save()

      stream.chatRoomId = chatRoom._id
      await stream.save()

      reply.send({
        success: true,
        message: '直播间创建成功',
        data: {
          stream,
          chatRoomId: chatRoom._id
        }
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '创建直播间失败: ' + error.message
      })
    }
  })

  // 获取直播列表
  fastify.get('/streams', {
    schema: {
      tags: ['直播'],
      summary: '获取直播列表',
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['scheduled', 'live', 'ended'] },
          category: { type: 'string' },
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { status, category, page = 1, limit = 20 } = request.query
      const skip = (page - 1) * limit

      const query = {}
      if (status) query.status = status
      if (category) query.category = category
      if (!status) query.status = { $in: ['scheduled', 'live'] } // 默认只显示进行中和计划中的

      const [streams, total] = await Promise.all([
        fastify.models.LiveStream.find(query)
          .populate('chefId', 'username avatar profile.nickname')
          .sort({ status: 1, scheduledAt: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit),
        fastify.models.LiveStream.countDocuments(query)
      ])

      reply.send({
        success: true,
        data: {
          streams,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '获取直播列表失败: ' + error.message
      })
    }
  })

  // 开始直播
  fastify.post('/streams/:streamId/start', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['直播'],
      summary: '开始直播',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          streamId: { type: 'string' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const stream = await fastify.models.LiveStream.findById(request.params.streamId)
      
      if (!stream) {
        return reply.code(404).send({
          success: false,
          message: '直播间不存在'
        })
      }

      if (stream.chefId.toString() !== request.user._id.toString()) {
        return reply.code(403).send({
          success: false,
          message: '只能操作自己的直播间'
        })
      }

      if (stream.status === 'live') {
        return reply.code(400).send({
          success: false,
          message: '直播已在进行中'
        })
      }

      stream.status = 'live'
      stream.startedAt = new Date()
      await stream.save()

      reply.send({
        success: true,
        message: '直播已开始',
        data: stream
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '开始直播失败: ' + error.message
      })
    }
  })

  // 结束直播
  fastify.post('/streams/:streamId/end', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['直播'],
      summary: '结束直播',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          streamId: { type: 'string' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const stream = await fastify.models.LiveStream.findById(request.params.streamId)
      
      if (!stream) {
        return reply.code(404).send({
          success: false,
          message: '直播间不存在'
        })
      }

      if (stream.chefId.toString() !== request.user._id.toString()) {
        return reply.code(403).send({
          success: false,
          message: '只能操作自己的直播间'
        })
      }

      if (stream.status !== 'live') {
        return reply.code(400).send({
          success: false,
          message: '直播未在进行中'
        })
      }

      stream.status = 'ended'
      stream.endedAt = new Date()
      stream.duration = Math.floor((stream.endedAt - stream.startedAt) / 1000) // 秒
      await stream.save()

      reply.send({
        success: true,
        message: '直播已结束',
        data: stream
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '结束直播失败: ' + error.message
      })
    }
  })
}

// 生成直播密钥
function generateStreamKey() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}