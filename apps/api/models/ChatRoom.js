const mongoose = require('mongoose')

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  type: {
    type: String,
    enum: ['recipe_discussion', 'chef_fan', 'live_stream', 'general'],
    default: 'general'
  },
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'chef_fan' || this.type === 'live_stream'
    }
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: function() {
      return this.type === 'recipe_discussion'
    }
  },
  avatar: String,
  isPublic: {
    type: Boolean,
    default: true
  },
  maxMembers: {
    type: Number,
    default: 500
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    },
    isMuted: {
      type: Boolean,
      default: false
    }
  }],
  settings: {
    allowImages: { type: Boolean, default: true },
    allowFiles: { type: Boolean, default: false },
    slowMode: { type: Number, default: 0 }, // 慢速模式间隔(秒)
    requireApproval: { type: Boolean, default: false }
  },
  stats: {
    totalMessages: { type: Number, default: 0 },
    activeMembers: { type: Number, default: 0 },
    lastActivity: Date
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// 更新时间中间件
chatRoomSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// 索引
chatRoomSchema.index({ chefId: 1, type: 1 })
chatRoomSchema.index({ recipeId: 1 })
chatRoomSchema.index({ isPublic: 1, isActive: 1 })
chatRoomSchema.index({ 'members.userId': 1 })
chatRoomSchema.index({ createdAt: -1 })

module.exports = mongoose.model('ChatRoom', chatRoomSchema)