// 简单的 API 测试脚本
const axios = require('axios')

const BASE_URL = 'http://localhost:3000'

async function testAPI() {
  try {
    console.log('🚀 开始测试 API...\n')

    // 1. 测试用户注册
    console.log('1. 测试用户注册...')
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: '123456',
      role: 'user'
    })
    console.log('✅ 用户注册成功')
    
    const userToken = registerResponse.data.data.token
    const headers = { Authorization: `Bearer ${userToken}` }

    // 2. 测试厨师注册
    console.log('2. 测试厨师注册...')
    const chefResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: 'testchef',
      email: 'chef@example.com',
      password: '123456',
      role: 'chef'
    })
    console.log('✅ 厨师注册成功')
    
    const chefToken = chefResponse.data.data.token
    const chefHeaders = { Authorization: `Bearer ${chefToken}` }

    // 3. 测试食物扫描
    console.log('3. 测试食物扫描...')
    await axios.post(`${BASE_URL}/food-scan/scan`, {
      foodName: '苹果',
      category: 'fruit',
      weight: 150,
      mealType: 'snack',
      nutrition: {
        calories: 78,
        protein: 0.4,
        carbohydrates: 20.6,
        fat: 0.2
      }
    }, { headers })
    console.log('✅ 食物扫描记录保存成功')

    // 4. 测试创建餐谱
    console.log('4. 测试创建餐谱...')
    const recipeResponse = await axios.post(`${BASE_URL}/recipes`, {
      title: '简单炒蛋',
      description: '营养丰富的家常炒蛋',
      category: 'main_course',
      cuisineType: 'chinese',
      difficulty: 'easy',
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      ingredients: [
        { name: '鸡蛋', amount: 3, unit: 'piece' },
        { name: '盐', amount: 1, unit: 'tsp' }
      ],
      steps: [
        { stepNumber: 1, instruction: '打散鸡蛋，加入盐调味' },
        { stepNumber: 2, instruction: '热锅下油，倒入蛋液炒熟' }
      ]
    }, { headers: chefHeaders })
    console.log('✅ 餐谱创建成功')

    const recipeId = recipeResponse.data.data._id

    // 5. 测试获取餐谱列表
    console.log('5. 测试获取餐谱列表...')
    await axios.get(`${BASE_URL}/recipes`)
    console.log('✅ 餐谱列表获取成功')

    // 6. 测试创建聊天室
    console.log('6. 测试创建聊天室...')
    const chatRoomResponse = await axios.post(`${BASE_URL}/chat/rooms`, {
      name: '美食交流群',
      description: '大家一起分享美食心得',
      type: 'general'
    }, { headers: chefHeaders })
    console.log('✅ 聊天室创建成功')

    // 7. 测试加入聊天室
    console.log('7. 测试加入聊天室...')
    const roomId = chatRoomResponse.data.data._id
    await axios.post(`${BASE_URL}/chat/rooms/${roomId}/join`, {}, { headers })
    console.log('✅ 加入聊天室成功')

    // 8. 测试创建直播间
    console.log('8. 测试创建直播间...')
    await axios.post(`${BASE_URL}/live-stream/streams`, {
      title: '今日烹饪教学',
      description: '教大家做简单家常菜',
      category: 'cooking'
    }, { headers: chefHeaders })
    console.log('✅ 直播间创建成功')

    console.log('\n🎉 所有 API 测试通过！')

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message)
  }
}

// 运行测试
if (require.main === module) {
  testAPI()
}

module.exports = testAPI