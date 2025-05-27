import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 axios 实例
const createAxiosInstance = (baseURL: string,
                             defaultHeaders: Record<string, string> = {}): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: defaultHeaders,
    timeout: 10000, // 默认超时10秒
  });
  return instance;
};

// 异常重试封装
async function requestWithRetry<T = any>(
  instance: AxiosInstance,
  config: AxiosRequestConfig,
  retryCount: number = 3,
  retryDelay: number = 1000
): Promise<AxiosResponse<T>> {
  let lastError;
  for (let i = 0; i < retryCount; i++) {
    try {
      return await instance.request<T>(config);
    } catch (error) {
      lastError = error;
      // 只对网络错误或超时进行重试
      if (!error.isAxiosError || (error.response && error.response.status < 500)) {
        break;
      }
      await new Promise(res => setTimeout(res, retryDelay));
    }
  }
  throw lastError;
}

// 响应式请求框架主接口
class ReactAxios {
  private instance: AxiosInstance;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.instance = createAxiosInstance(baseURL, defaultHeaders);
  }

  setHeader(key: string, value: string) {
    this.instance.defaults.headers.common[key] = value;
  }

  removeHeader(key: string) {
    delete this.instance.defaults.headers.common[key];
  }

  async request<T = any>(
    config: AxiosRequestConfig,
    retryCount: number = 1,
    retryDelay: number = 1000
  ): Promise<AxiosResponse<T>> {
    return requestWithRetry<T>(this.instance, config, retryCount, retryDelay);
  }

  // 快捷方法
  get<T = any>(url: string, config?: AxiosRequestConfig, retryCount?: number, retryDelay?: number) {
    return this.request<T>({ ...config, url, method: 'get' }, retryCount, retryDelay);
  }
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig, retryCount?: number, retryDelay?: number) {
    return this.request<T>({ ...config, url, method: 'post', data }, retryCount, retryDelay);
  }
  // 其他方法可按需扩展
}

export default ReactAxios;

