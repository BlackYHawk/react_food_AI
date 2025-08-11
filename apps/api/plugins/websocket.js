'use strict'

const fp = require('fastify-plugin')

async function websocket(fastify, options) {
  // 注册 WebSocket 支持
  await fastify.register(require('@fastify/websocket'))

  // 存储活跃的 WebSocket 连接
  const connections = new Map()
  const roomConnections = new Map()

  fastify.decorate('websocket', {
    // 添加连接到房间
    addToRoom: (roomId, userId, connection) => {
      if (!roomConnections.has(roomId)) {
        roomConnections.set(roomId, new Map())
      }
      roomConnections.get(roomId).set(userId, connection)
      connections.set(userId, { connection, roomId })
    },

    // 从房间移除连接
    removeFromRoom: (userId) => {
      const userConnection = connections.get(userId)
      if (userConnection) {
        const { roomId } = userConnection
        const roomConns = roomConnections.get(roomId)
        if (roomConns) {
          roomConns.delete(userId)
          if (roomConns.size === 0) {
            roomConnections.delete(roomId)
          }
        }
        connections.delete(userId)
      }
    },

    // 向房间广播消息
    broadcastToRoom: (roomId, message, excludeUserId = null) => {
      const roomConns = roomConnections.get(roomId)
      if (roomConns) {
        roomConns.forEach((connection, userId) => {
          if (userId !== excludeUserId && connection.readyState === 1) {
            connection.send(JSON.stringify(message))
          }
        })
      }
    },

    // 向特定用户发送消息
    sendToUser: (userId, message) => {
      const userConnection = connections.get(userId)
      if (userConnection && userConnection.connection.readyState === 1) {
        userConnection.connection.send(JSON.stringify(message))
      }
    },

    // 获取房间在线用户数
    getRoomUserCount: (roomId) => {
      const roomConns = roomConnections.get(roomId)
      return roomConns ? roomConns.size : 0
    }
  })

  fastify.log.info('WebSocket 插件已注册')
}

module.exports = fp(websocket)