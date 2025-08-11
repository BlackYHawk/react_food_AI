const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'chef', 'admin'],
    default: 'user'
  },
  profile: {
    nickname: String,
    bio: String,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    height: Number, // cm
    weight: Number, // kg
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate'
    },
    dietaryRestrictions: [String], // 饮食限制：素食、无麸质等
    allergies: [String], // 过敏信息
    healthGoals: [String] // 健康目标：减重、增肌等
  },
  preferences: {
    cuisineTypes: [String], // 偏好菜系
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'very_hot'],
      default: 'medium'
    },
    cookingTime: {
      type: String,
      enum: ['quick', 'medium', 'long'], // 快手菜、中等时间、精细烹饪
      default: 'medium'
    }
  },
  stats: {
    totalScans: { type: Number, default: 0 },
    favoriteRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    followingChefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: Date,
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
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// 索引
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ role: 1 })

module.exports = mongoose.model('User', userSchema)