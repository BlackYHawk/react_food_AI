'use strict'

module.exports = async function (fastify, opts) {
  // 保存食物扫描记录
  fastify.post('/scan', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['食物扫描'],
      summary: '保存食物扫描记录',
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['foodName', 'category', 'weight', 'mealType'],
        properties: {
          foodName: { type: 'string' },
          foodNameEn: { type: 'string' },
          category: { 
            type: 'string', 
            enum: ['fruit', 'vegetable', 'meat', 'seafood', 'dairy', 'grain', 'snack', 'beverage', 'other'] 
          },
          brand: { type: 'string' },
          barcode: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } },
          weight: { type: 'number', minimum: 0 },
          nutrition: {
            type: 'object',
            properties: {
              calories: { type: 'number' },
              protein: { type: 'number' },
              carbohydrates: { type: 'number' },
              fat: { type: 'number' },
              fiber: { type: 'number' },
              sugar: { type: 'number' },
              sodium: { type: 'number' }
            }
          },
          scanMethod: { type: 'string', enum: ['camera', 'barcode', 'manual'] },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          mealType: { type: 'string', enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
          consumedAt: { type: 'string', format: 'date-time' },
          notes: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const scanData = {
        ...request.body,
        userId: request.user._id
      }

      const foodScan = new fastify.models.FoodScan(scanData)
      await foodScan.save()

      // 更新用户扫描统计
      await fastify.models.User.findByIdAndUpdate(
        request.user._id,
        { $inc: { 'stats.totalScans': 1 } }
      )

      reply.send({
        success: true,
        message: '食物扫描记录保存成功',
        data: foodScan
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '保存失败: ' + error.message
      })
    }
  })

  // 获取用户的扫描历史
  fastify.get('/history', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['食物扫描'],
      summary: '获取用户扫描历史',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          category: { type: 'string' },
          mealType: { type: 'string' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { page = 1, limit = 20, category, mealType, startDate, endDate } = request.query
      const skip = (page - 1) * limit

      // 构建查询条件
      const query = { userId: request.user._id }
      
      if (category) query.category = category
      if (mealType) query.mealType = mealType
      if (startDate || endDate) {
        query.consumedAt = {}
        if (startDate) query.consumedAt.$gte = new Date(startDate)
        if (endDate) query.consumedAt.$lte = new Date(endDate + 'T23:59:59.999Z')
      }

      const [scans, total] = await Promise.all([
        fastify.models.FoodScan.find(query)
          .sort({ consumedAt: -1 })
          .skip(skip)
          .limit(limit),
        fastify.models.FoodScan.countDocuments(query)
      ])

      reply.send({
        success: true,
        data: {
          scans,
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
        message: '获取历史记录失败: ' + error.message
      })
    }
  })

  // 获取营养统计
  fastify.get('/nutrition-stats', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['食物扫描'],
      summary: '获取营养统计数据',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['day', 'week', 'month'], default: 'day' },
          date: { type: 'string', format: 'date' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { period = 'day', date } = request.query
      const targetDate = date ? new Date(date) : new Date()
      
      let startDate, endDate
      
      switch (period) {
        case 'day':
          startDate = new Date(targetDate.setHours(0, 0, 0, 0))
          endDate = new Date(targetDate.setHours(23, 59, 59, 999))
          break
        case 'week':
          const weekStart = new Date(targetDate)
          weekStart.setDate(targetDate.getDate() - targetDate.getDay())
          startDate = new Date(weekStart.setHours(0, 0, 0, 0))
          endDate = new Date(weekStart.setDate(weekStart.getDate() + 6))
          endDate.setHours(23, 59, 59, 999)
          break
        case 'month':
          startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
          endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999)
          break
      }

      const stats = await fastify.models.FoodScan.aggregate([
        {
          $match: {
            userId: request.user._id,
            consumedAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            totalCalories: { $sum: '$nutrition.calories' },
            totalProtein: { $sum: '$nutrition.protein' },
            totalCarbs: { $sum: '$nutrition.carbohydrates' },
            totalFat: { $sum: '$nutrition.fat' },
            totalFiber: { $sum: '$nutrition.fiber' },
            totalSugar: { $sum: '$nutrition.sugar' },
            totalSodium: { $sum: '$nutrition.sodium' },
            scanCount: { $sum: 1 }
          }
        }
      ])

      const result = stats[0] || {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        totalSugar: 0,
        totalSodium: 0,
        scanCount: 0
      }

      reply.send({
        success: true,
        data: {
          period,
          date: targetDate.toISOString().split('T')[0],
          nutrition: result
        }
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '获取营养统计失败: ' + error.message
      })
    }
  })
}