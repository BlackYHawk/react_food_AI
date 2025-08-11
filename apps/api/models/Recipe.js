const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'clove', 'bunch']
  },
  notes: String
})

const stepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  instruction: {
    type: String,
    required: true
  },
  duration: Number,       // 步骤耗时 (分钟)
  temperature: Number,    // 温度 (摄氏度)
  images: [String],       // 步骤图片
  tips: String           // 小贴士
})

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [String],       // 成品图片
  videoUrl: String,       // 制作视频
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main_course', 'dessert', 'soup', 'salad', 'beverage', 'snack']
  },
  cuisineType: {
    type: String,
    required: true,
    enum: ['chinese', 'western', 'japanese', 'korean', 'thai', 'indian', 'italian', 'french', 'mexican', 'other']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  prepTime: {
    type: Number,         // 准备时间 (分钟)
    required: true
  },
  cookTime: {
    type: Number,         // 烹饪时间 (分钟)
    required: true
  },
  servings: {
    type: Number,         // 份数
    required: true,
    min: 1
  },
  ingredients: [ingredientSchema],
  steps: [stepSchema],
  nutrition: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number
  },
  tags: [String],         // 标签：素食、无麸质、低卡等
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'very_hot'],
    default: 'medium'
  },
  equipment: [String],    // 所需设备
  dietaryInfo: {
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isDairyFree: { type: Boolean, default: false },
    isKeto: { type: Boolean, default: false },
    isLowCarb: { type: Boolean, default: false }
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
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
recipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = Date.now()
  }
  next()
})

// 索引
recipeSchema.index({ chefId: 1, createdAt: -1 })
recipeSchema.index({ category: 1, cuisineType: 1 })
recipeSchema.index({ isPublished: 1, publishedAt: -1 })
recipeSchema.index({ isFeatured: 1, 'stats.rating': -1 })
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' })
recipeSchema.index({ 'stats.views': -1 })
recipeSchema.index({ 'stats.likes': -1 })

module.exports = mongoose.model('Recipe', recipeSchema)