//axios的封装
import axios from "axios";
import { getToken } from "./token";

//1.根域名配置
//2.超时时间
//3.请求拦截器，响应拦截器

const http = axios.create({
  baseURL: "http://geek.itheima.net/v1_0",
  timeout: 10000, // 从5000ms延长到10000ms
});

// 添加请求拦截器
//请求发送之前做拦截插入一些自定义的配置，进行参数处理
http.interceptors.request.use(
  (config) => {
    //操作这个config 注入token数据
    //1.获取到token
    //2.按照后端的格式要求做token拼接
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export { http as request };
