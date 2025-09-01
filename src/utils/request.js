//axios的封装
import axios from "axios";
import { getToken, removeToken } from "./token";
import router from "@/router";

//1.根域名配置
//2.超时时间
//3.请求拦截器，响应拦截器

const http = axios.create({
  baseURL: "http://geek.itheima.net/v1_0",
  // baseURL: "http://127.0.0.1:4523/mock/7035781",
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
    //监控401 token失效

    // `console.dir(error)` 用于在控制台以对象形式打印错误信息，方便开发者调试查看错误详情。
    // `return Promise.reject(error)` 用于将错误继续抛出，使得调用该请求的地方可以捕获并处理这个错误。
    // `console.dir()` 是 JavaScript 中 console 对象的一个方法，用于在控制台以对象的形式打印指定对象，
    // 它会展示对象的所有属性和属性值，方便开发者查看对象的详细结构。这里使用 `console.dir(error)` 是为了打印错误对象的详细信息，便于调试。
    console.dir(error);
    if (error.response.status === 401) {
      removeToken();
      router.navigate("/login");
      window.location.reload();
    }
    // 在响应拦截器的错误处理中使用 Promise.reject(error)，是因为 axios 请求本身是基于 Promise 的。
    // 当请求出错时，为了将错误信息传递给调用该请求的地方，让调用者能够捕获并处理这个错误，
    // 所以需要返回一个被拒绝的 Promise，这样调用者就可以使用 .catch() 方法来捕获错误。
    // `Promise.reject(error)` 用于返回一个被拒绝的 Promise，将错误信息传递给调用该请求的地方。

    return Promise.reject(error);
  }
);

export { http as request };
