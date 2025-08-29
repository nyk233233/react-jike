// 全局Mock数据系统

// Mock数据系统的定义：
// 全局Mock数据系统是一种在后端API接口不可用或未开发完成时，
// 用于模拟接口响应的解决方案。它允许前端开发人员在不依赖真实后端服务的情况下，
// 继续开发和测试前端应用功能。

// Mock数据存储对象，按照接口路径和请求方法组织
const mockData = {
  // 用户相关接口的Mock数据
  '/authorizations': {
    // POST请求的Mock响应数据
    post: {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-token-123456',
        refresh_token: 'mock-refresh-token-654321'
      }
    }
  },
  '/user/profile': {
    // GET请求的Mock响应数据
    get: {
      code: 200,
      message: '获取用户信息成功',
      data: {
        id: 1,
        name: '测试用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        email: 'test@example.com',
        mobile: '13800138000',
        gender: 1,
        birthday: '1990-01-01',
        real_name: '测试姓名',
        slogan: 'Hello World!'
      }
    }
  },
  '/user/channels': {
    get: {
      code: 200,
      message: '获取频道成功',
      data: {
        channels: [
          { id: 1, name: '推荐' },
          { id: 2, name: '科技' },
          { id: 3, name: '娱乐' },
          { id: 4, name: '体育' },
          { id: 5, name: '财经' }
        ]
      }
    }
  },
  // 文章相关接口的Mock数据
  '/articles': {
    get: {
      code: 200,
      message: '获取文章列表成功',
      data: {
        results: [
          {
            art_id: 1,
            title: 'React性能优化实战技巧',
            cover: {
              type: 3,
              images: [
                'https://picsum.photos/id/1/300/200',
                'https://picsum.photos/id/2/300/200',
                'https://picsum.photos/id/3/300/200'
              ]
            },
            pubdate: '2023-10-01 12:00:00',
            aut_id: 1,
            aut_name: '前端工程师',
            aut_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author1',
            comm_count: 100,
            collect_count: 200,
            like_count: 300,
            read_count: 400
          },
          {
            art_id: 2,
            title: 'Vue3 Composition API深入解析',
            cover: {
              type: 1,
              images: ['https://picsum.photos/id/4/300/200']
            },
            pubdate: '2023-09-25 15:30:00',
            aut_id: 2,
            aut_name: 'Vue专家',
            aut_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=author2',
            comm_count: 80,
            collect_count: 150,
            like_count: 250,
            read_count: 350
          }
        ],
        pre_timestamp: 1633046400
      }
    }
  }
};

/**
 * 添加新的Mock接口数据
 * @param {string} path - 接口路径
 * @param {string} method - 请求方法（get, post等）
 * @param {object} data - Mock响应数据
 */
export const addMockApi = (path, method, data) => {
  if (!mockData[path]) {
    mockData[path] = {};
  }
  mockData[path][method.toLowerCase()] = data;
};

/**
 * 获取指定接口和方法的Mock数据
 * @param {string} path - 接口路径
 * @param {string} method - 请求方法
 * @returns {object|null} Mock数据或null（如果不存在）
 */
export const getMockData = (path, method) => {
  if (mockData[path] && mockData[path][method.toLowerCase()]) {
    return mockData[path][method.toLowerCase()];
  }
  return null;
};

export default mockData;