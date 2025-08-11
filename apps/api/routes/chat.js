'use strict'

module.exports = async function (fastify, opts) {
  // 获取聊天室列表
  fastify.get('/rooms', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['聊天'],
      summary: '获取聊天室列表',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['recipe_discussion', 'chef_fan', 'live_stream', 'general'] },
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { type, page = 1, limit = 20 } = request.query
      const skip = (page - 1) * limit

      const query = { isActive: true, isPublic: true }
      if (type) query.type = type

      const [rooms, total] = await Promise.all([
        fastify.models.ChatRoom.find(query)
          .populate('chefId', 'username avatar profile.nickname')
          .populate('recipeId', 'title images')
          .populate('createdBy', 'username avatar')
          .sort({ 'stats.lastActivity': -1, createdAt: -1 })
          .skip(skip)
          .limit(limit),
        fastify.models.ChatRoom.countDocuments(query)
      ])

      reply.send({
        success: true,
        data: {
          rooms,
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
        message: '获取聊天室列表失败: ' + error.message
      })
    }
  })

  // 创建聊天室
  fastify.post('/rooms', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['聊天'],
      summary: '创建聊天室',
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['name', 'type'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['recipe_discussion', 'chef_fan', 'live_stream', 'general'] },
          chefId: { type: 'string' },
          recipeId: { type: 'string' },
          avatar: { type: 'string' },
          isPublic: { type: 'boolean', default: true },
          maxMembers: { type: 'integer', minimum: 2, maximum: 1000, default: 500 }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const roomData = {
        ...request.body,
        createdBy: request.user._id,
        members: [{
          userId: request.user._id,
          role: 'admin',
          joinedAt: new Date()
        }]
      }

      // 验证厨师ID和餐谱ID
      if (roomData.chefId) {
        const chef = await fastify.models.User.findById(roomData.chefId)
        if (!chef || chef.role !== 'chef') {
          return reply.code(400).send({
            success: false,
            message: '指定的厨师不存在'
          })
        }
      }

      if (roomData.recipeId) {
        const recipe = await fastify.models.Recipe.findById(roomData.recipeId)
        if (!recipe) {
          return reply.code(400).send({
            success: false,
            message: '指定的餐谱不存在'
          })
        }
      }

      const room = new fastify.models.ChatRoom(roomData)
      await room.save()

      await room.populate([
        { path: 'chefId', select: 'username avatar profile.nickname' },
        { path: 'recipeId', select: 'title images' },
        { path: 'createdBy', select: 'username avatar' }
      ])

      reply.send({
        success: true,
        message: '聊天室创建成功',
        data: room
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '创建聊天室失败: ' + error.message
      })
    }
  })

  // 加入聊天室
  fastify.post('/rooms/:roomId/join', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['聊天'],
      summary: '加入聊天室',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          roomId: { type: 'string' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { roomId } = request.params
      const userId = request.user._id

      const room = await fastify.models.ChatRoom.findById(roomId)
      if (!room || !room.isActive) {
        return reply.code(404).send({
          success: false,
          message: '聊天室不存在'
        })
      }

      // 检查是否已经是成员
      const isMember = room.members.some(member => member.userId.toString() === userId.toString())
      if (isMember) {
        return reply.code(400).send({
          success: false,
          message: '您已经是该聊天室的成员'
        })
      }

      // 检查人数限制
      if (room.members.length >= room.maxMembers) {
        return reply.code(400).send({
          success: false,
          message: '聊天室已满'
        })
      }

      // 添加成员
      room.members.push({
        userId,
        joinedAt: new Date()
      })
      await room.save()

      reply.send({
        success: true,
        message: '成功加入聊天室'
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '加入聊天室失败: ' + error.message
      })
    }
  })

  // 获取聊天消息
  fastify.get('/rooms/:roomId/messages', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['聊天'],
      summary: '获取聊天消息',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          roomId: { type: 'string' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
          before: { type: 'string' } // 消息ID，用于分页
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { roomId } = request.params
      const { page = 1, limit = 50, before } = request.query

      // 验证用户是否为房间成员
      const room = await fastify.models.ChatRoom.findById(roomId)
      if (!room) {
        return reply.code(404).send({
          success: false,
          message: '聊天室不存在'
        })
      }

      const isMember = room.members.some(member => 
        member.userId.toString() === request.user._id.toString()
      )
      if (!isMember) {
        return reply.code(403).send({
          success: false,
          message: '您不是该聊天室的成员'
        })
      }

      // 构建查询条件
      const query = { roomId, isDeleted: false }
      if (before) {
        query._id = { $lt: before }
      }

      const messages = await fastify.models.Message.find(query)
        .populate('senderId', 'username avatar profile.nickname')
        .populate('replyTo', 'content senderId')
        .populate('attachments.recipeId', 'title images')
        .sort({ createdAt: -1 })
        .limit(limit)

      reply.send({
        success: true,
        data: {
          messages: messages.reverse(), // 按时间正序返回
          hasMore: messages.length === limit
        }
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '获取消息失败: ' + error.message
      })
    }
  })

  // WebSocket 聊天连接
  fastify.register(async function (fastify) {
    fastify.get('/rooms/:roomId/ws', { websocket: true }, async (connection, request) => {
      try {
        // 验证用户身份
        const token = request.query.token
        if (!token) {
          connection.close(1008, '未提供认证令牌')
          return
        }

        const decoded = fastify.jwt.verify(token)
        const user = await fastify.models.User.findById(decoded.userId)
        if (!user) {
          connection.close(1008, '用户不存在')
          return
        }

        const roomId = request.params.roomId
        
        // 验证房间和成员身份
        const room = await fastify.models.ChatRoom.findById(roomId)
        if (!room) {
          connection.close(1008, '聊天室不存在')
          return
        }

        const isMember = room.members.some(member => 
          member.userId.toString() === user._id.toString()
        )
        if (!isMember) {
          connection.close(1008, '您不是该聊天室的成员')
          return
        }

        // 添加到房间连接
        fastify.websocket.addToRoom(roomId, user._id.toString(), connection)

        // 发送欢迎消息
        connection.send(JSON.stringify({
          type: 'system',
          message: '连接成功',
          roomId,
          onlineCount: fastify.websocket.getRoomUserCount(roomId)
        }))

        // 广播用户上线
        fastify.websocket.broadcastToRoom(roomId, {
          type: 'user_joined',
          user: {
            _id: user._id,
            username: user.username,
            avatar: user.avatar
          },
          onlineCount: fastify.websocket.getRoomUserCount(roomId)
        }, user._id.toString())

        // 处理消息
        connection.on('message', async (message) => {
          try {
            const data = JSON.parse(message.toString())
            
            if (data.type === 'chat_message') {
              // 保存消息到数据库
              const newMessage = new fastify.models.Message({
                roomId,
                senderId: user._id,
                content: data.content,
                type: data.messageType || 'text',
                attachments: data.attachments || [],
                replyTo: data.replyTo
              })
              
              await newMessage.save()
              await newMessage.populate([
                { path: 'senderId', select: 'username avatar profile.nickname' },
                { path: 'replyTo', select: 'content senderId' }
              ])

              // 更新房间活跃度
              await fastify.models.ChatRoom.findByIdAndUpdate(roomId, {
                $inc: { 'stats.totalMessages': 1 },
                'stats.lastActivity': new Date()
              })

              // 广播消息
              fastify.websocket.broadcastToRoom(roomId, {
                type: 'new_message',
                message: newMessage
              })
            }
          } catch (error) {
            fastify.log.error('WebSocket 消息处理错误:', error)
            connection.send(JSON.stringify({
              type: 'error',
              message: '消息处理失败'
            }))
          }
        })

        // 处理连接关闭
        connection.on('close', () => {
          fastify.websocket.removeFromRoom(user._id.toString())
          
          // 广播用户离线
          fastify.websocket.broadcastToRoom(roomId, {
            type: 'user_left',
            userId: user._id,
            onlineCount: fastify.websocket.getRoomUserCount(roomId)
          })
        })

      } catch (error) {
        fastify.log.error('WebSocket 连接错误:', error)
        connection.close(1011, '服务器错误')
      }
    })
  })
}