const mongoose = require('mongoose')

const nutritionSchema = new mongoose.Schema({
  calories: Number,        // 卡路里
  protein: Number,         // 蛋白质 (g)
  carbohydrates: Number,   // 碳水化合物 (g)
  fat: Number,            // 脂肪 (g)
  fiber: Number,          // 纤维 (g)
  sugar: Number,          // 糖分 (g)
  sodium: Number,         // 钠 (mg)
  cholesterol: Number,    // 胆固醇 (mg)
  vitamins: {
    vitaminA: Number,     // 维生素A (μg)
    vitaminC: Number,     // 维生素C (mg)
    vitaminD: Number,     // 维生素D (μg)
    vitaminE: Number,     // 维生素E (mg)
    vitaminK: Number,     // 维生素K (μg)
    vitaminB1: Number,    // 维生素B1 (mg)
    vitaminB2: Number,    // 维生素B2 (mg)
    vitaminB6: Number,    // 维生素B6 (mg)
    vitaminB12: Number,   // 维生素B12 (μg)
    folate: Number        // 叶酸 (μg)
  },
  minerals: {
    calcium: Number,      // 钙 (mg)
    iron: Number,         // 铁 (mg)
    magnesium: Number,    // 镁 (mg)
    phosphorus: Number,   // 磷 (mg)
    potassium: Number,    // 钾 (mg)
    zinc: Number          // 锌 (mg)
  }
})

const foodScanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: true,
    trim: true
  },
  foodNameEn: String,     // 英文名称
  category: {
    type: String,
    enum: ['fruit', 'vegetable', 'meat', 'seafood', 'dairy', 'grain', 'snack', 'beverage', 'other'],
    required: true
  },
  brand: String,          // 品牌
  barcode: String,        // 条形码
  images: [String],       // 扫描的图片URLs
  weight: {
    type: Number,         // 重量 (g)
    required: true
  },
  nutrition: nutritionSchema,
  scanMethod: {
    type: String,
    enum: ['camera', 'barcode', 'manual'],
    default: 'camera'
  },
  confidence: {
    type: Number,         // AI识别置信度 0-1
    min: 0,
    max: 1
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  consumedAt: {
    type: Date,
    default: Date.now
  },
  notes: String,          // 用户备注
  tags: [String],         // 标签
  isVerified: {
    type: Boolean,
    default: false        // 是否经过营养师验证
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// 索引
foodScanSchema.index({ userId: 1, consumedAt: -1 })
foodScanSchema.index({ category: 1 })
foodScanSchema.index({ foodName: 'text' })
foodScanSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('FoodScan', foodScanSchema)