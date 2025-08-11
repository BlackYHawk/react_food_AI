const mongoose = require('mongoose')

const liveStreamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: String,
  category: {
    type: String,
    enum: ['cooking', 'baking', 'tutorial', 'chat'],
    default: 'cooking'
  },
  status: {
    type: String,
    enum: ['created', 'scheduled', 'live', 'ended', 'cancelled'],
    default: 'created'
  },
  streamKey: {
    type: String,
    required: true,
    unique: true
  },
  rtmpUrl: String,
  playbackUrl: String,
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  maxViewers: {
    type: Number,
    default: 1000,
    min: 1,
    max: 10000
  },
  currentViewers: {
    type: Number,
    default: 0
  },
  totalViewers: {
    type: Number,
    default: 0
  },
  peakViewers: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  scheduledAt: Date,
  startedAt: Date,
  endedAt: Date,
  duration: Number, // 直播时长（秒）
  tags: [String],
  settings: {
    allowChat: { type: Boolean, default: true },
    allowGifts: { type: Boolean, default: true },
    chatMode: { 
      type: String, 
      enum: ['all', 'followers', 'subscribers'], 
      default: 'all' 
    },
    recordStream: { type: Boolean, default: false }
  },
  recordingUrl: String, // 录播地址
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
liveStreamSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// 索引
liveStreamSchema.index({ chefId: 1, status: 1 })
liveStreamSchema.index({ status: 1, scheduledAt: 1 })
liveStreamSchema.index({ createdAt: -1 })
liveStreamSchema.index({ streamKey: 1 })

module.exports = mongoose.model('LiveStream', liveStreamSchema)