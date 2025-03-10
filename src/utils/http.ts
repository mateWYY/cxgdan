// src/http.js
 
import axios from 'axios';
import { ElMessage } from 'element-plus'

 
// 创建一个新的 axios 实例
const service = axios.create({
  baseURL: 'http://localhost:5173/api/', // 设置基础 URL
  timeout: 0, // 设置超时时间
  headers: { 'Content-Type': 'application/json' } //设置默认的Content-Type
});
 
// 添加请求拦截器
service.interceptors.request.use(
  config => {
    // 在这里可以设置请求头、请求参数等return config
    // 例如添加 token 到请求头
    const token = localStorage.getItem('token'); // 示例：从本地存储获取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.log(error)
    return Promise.reject(error);
  }
);
 
// 添加响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    // return response.data; // 返回实际的数据而不是整个响应对象
    // 在这里处理返回数据
    const { data } = response
    if (data.code !== 200) {
      ElMessage({
        message: data.msg,
        type: 'error',
        plain: true,
      })
      // 对响应code做点什么
      if (data.code === 401) {
        // 处理未授权的情况
        // 可能需要重定向到登录页面或者其他操作
      }
      console.error('Error:', data.msg)
      return data
    } else {
      return data
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error);
  }
);
 
export default service;