'use strict'

module.exports = async function (fastify, opts) {
  // 获取餐谱列表
  fastify.get('/', {
    preHandler: [fastify.optionalAuth],
    schema: {
      tags: ['餐谱'],
      summary: '获取餐谱列表',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
          category: { type: 'string' },
          cuisineType: { type: 'string' },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
          maxPrepTime: { type: 'integer' },
          maxCookTime: { type: 'integer' },
          tags: { type: 'string' },
          search: { type: 'string' },
          sortBy: { type: 'string', enum: ['newest', 'popular', 'rating', 'views'], default: 'newest' },
          featured: { type: 'boolean' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        category, 
        cuisineType, 
        difficulty, 
        maxPrepTime, 
        maxCookTime, 
        tags, 
        search, 
        sortBy = 'newest',
        featured 
      } = request.query
      
      const skip = (page - 1) * limit

      // 构建查询条件
      const query = { isPublished: true }
      
      if (category) query.category = category
      if (cuisineType) query.cuisineType = cuisineType
      if (difficulty) query.difficulty = difficulty
      if (maxPrepTime) query.prepTime = { $lte: maxPrepTime }
      if (maxCookTime) query.cookTime = { $lte: maxCookTime }
      if (tags) query.tags = { $in: tags.split(',') }
      if (featured !== undefined) query.isFeatured = featured
      if (search) {
        query.$text = { $search: search }
      }

      // 构建排序条件
      let sort = {}
      switch (sortBy) {
        case 'popular':
          sort = { 'stats.likes': -1, 'stats.views': -1 }
          break
        case 'rating':
          sort = { 'stats.rating': -1, 'stats.ratingCount': -1 }
          break
        case 'views':
          sort = { 'stats.views': -1 }
          break
        default:
          sort = { publishedAt: -1 }
      }

      const [recipes, total] = await Promise.all([
        fastify.models.Recipe.find(query)
          .populate('chefId', 'username avatar profile.nickname')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('-steps -ingredients'), // 列表页不返回详细步骤
        fastify.models.Recipe.countDocuments(query)
      ])

      reply.send({
        success: true,
        data: {
          recipes,
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
        message: '获取餐谱列表失败: ' + error.message
      })
    }
  })

  // 获取餐谱详情
  fastify.get('/:id', {
    preHandler: [fastify.optionalAuth],
    schema: {
      tags: ['餐谱'],
      summary: '获取餐谱详情',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const recipe = await fastify.models.Recipe.findById(request.params.id)
        .populate('chefId', 'username avatar profile.nickname profile.bio stats.followers')

      if (!recipe || !recipe.isPublished) {
        return reply.code(404).send({
          success: false,
          message: '餐谱不存在'
        })
      }

      // 增加浏览量
      await fastify.models.Recipe.findByIdAndUpdate(
        request.params.id,
        { $inc: { 'stats.views': 1 } }
      )

      reply.send({
        success: true,
        data: recipe
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '获取餐谱详情失败: ' + error.message
      })
    }
  })

  // 创建餐谱（厨师专用）
  fastify.post('/', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['餐谱'],
      summary: '创建餐谱',
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['title', 'description', 'category', 'cuisineType', 'difficulty', 'prepTime', 'cookTime', 'servings'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } },
          videoUrl: { type: 'string' },
          category: { type: 'string', enum: ['appetizer', 'main_course', 'dessert', 'soup', 'salad', 'beverage', 'snack'] },
          cuisineType: { type: 'string', enum: ['chinese', 'western', 'japanese', 'korean', 'thai', 'indian', 'italian', 'french', 'mexican', 'other'] },
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
          prepTime: { type: 'integer', minimum: 1 },
          cookTime: { type: 'integer', minimum: 1 },
          servings: { type: 'integer', minimum: 1 },
          ingredients: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name', 'amount', 'unit'],
              properties: {
                name: { type: 'string' },
                amount: { type: 'number' },
                unit: { type: 'string' },
                notes: { type: 'string' }
              }
            }
          },
          steps: {
            type: 'array',
            items: {
              type: 'object',
              required: ['stepNumber', 'instruction'],
              properties: {
                stepNumber: { type: 'integer' },
                instruction: { type: 'string' },
                duration: { type: 'integer' },
                temperature: { type: 'integer' },
                images: { type: 'array', items: { type: 'string' } },
                tips: { type: 'string' }
              }
            }
          },
          tags: { type: 'array', items: { type: 'string' } },
          spiceLevel: { type: 'string', enum: ['mild', 'medium', 'hot', 'very_hot'] },
          equipment: { type: 'array', items: { type: 'string' } },
          nutrition: { type: 'object' },
          dietaryInfo: { type: 'object' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      // 检查用户是否为厨师
      if (request.user.role !== 'chef' && request.user.role !== 'admin') {
        return reply.code(403).send({
          success: false,
          message: '只有厨师可以创建餐谱'
        })
      }

      const recipeData = {
        ...request.body,
        chefId: request.user._id
      }

      const recipe = new fastify.models.Recipe(recipeData)
      await recipe.save()

      reply.send({
        success: true,
        message: '餐谱创建成功',
        data: recipe
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '创建餐谱失败: ' + error.message
      })
    }
  })

  // 获取精选推荐餐谱
  fastify.get('/featured/recommendations', {
    preHandler: [fastify.optionalAuth],
    schema: {
      tags: ['餐谱'],
      summary: '获取精选推荐餐谱',
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 20, default: 10 }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const { limit = 10 } = request.query

      // 获取精选餐谱
      const featuredRecipes = await fastify.models.Recipe.find({
        isPublished: true,
        isFeatured: true
      })
        .populate('chefId', 'username avatar profile.nickname')
        .sort({ 'stats.rating': -1, 'stats.views': -1 })
        .limit(limit)
        .select('-steps -ingredients')

      // 如果用户已登录，可以基于用户偏好推荐
      let personalizedRecipes = []
      if (request.user && request.user.preferences) {
        const userPrefs = request.user.preferences
        const query = {
          isPublished: true,
          isFeatured: false
        }

        if (userPrefs.cuisineTypes && userPrefs.cuisineTypes.length > 0) {
          query.cuisineType = { $in: userPrefs.cuisineTypes }
        }
        if (userPrefs.spiceLevel) {
          query.spiceLevel = userPrefs.spiceLevel
        }

        personalizedRecipes = await fastify.models.Recipe.find(query)
          .populate('chefId', 'username avatar profile.nickname')
          .sort({ 'stats.rating': -1 })
          .limit(5)
          .select('-steps -ingredients')
      }

      reply.send({
        success: true,
        data: {
          featured: featuredRecipes,
          personalized: personalizedRecipes
        }
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '获取推荐餐谱失败: ' + error.message
      })
    }
  })

  // 收藏/取消收藏餐谱
  fastify.post('/:id/favorite', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['餐谱'],
      summary: '收藏/取消收藏餐谱',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async function (request, reply) {
    try {
      const recipeId = request.params.id
      const userId = request.user._id

      const user = await fastify.models.User.findById(userId)
      const isFavorited = user.stats.favoriteRecipes.includes(recipeId)

      if (isFavorited) {
        // 取消收藏
        await fastify.models.User.findByIdAndUpdate(userId, {
          $pull: { 'stats.favoriteRecipes': recipeId }
        })
        await fastify.models.Recipe.findByIdAndUpdate(recipeId, {
          $inc: { 'stats.favorites': -1 }
        })
      } else {
        // 添加收藏
        await fastify.models.User.findByIdAndUpdate(userId, {
          $addToSet: { 'stats.favoriteRecipes': recipeId }
        })
        await fastify.models.Recipe.findByIdAndUpdate(recipeId, {
          $inc: { 'stats.favorites': 1 }
        })
      }

      reply.send({
        success: true,
        message: isFavorited ? '已取消收藏' : '收藏成功',
        data: { isFavorited: !isFavorited }
      })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({
        success: false,
        message: '操作失败: ' + error.message
      })
    }
  })
}