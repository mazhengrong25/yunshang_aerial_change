/*
 * @Author: your name
 * @Date: 2020-10-29 10:30:51
 * @LastEditTime: 2020-10-29 11:20:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \positiond:\aerial\yunshang_aerial_change\src\api\api.js
 */
import axios from 'axios';

import { message } from 'ant-design-vue';

axios.defaults.baseURL = 'http://192.168.0.27:5005';

let instance = axios.create({
  timeout: 1000 * 12,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    token && (config.headers.Authorization = 'Bearer ' + token);
    return config;
  },
  (error) => Promise.error(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (!response.config.headers.Authorization) {
      refresh(response.config);
    }
    if(!response.data.isSuccess){
      message.warning(response.data.msg)
    }
    return response;
  },
  (error) => {
    message.error('接口数据错误，请联系管理员处理。错误信息：' + error);
    return Promise.reject(error);
  }
);

// 获取token
function refresh(config) {
  axios
    .get('api/token/authenticate')
    .then((res) => {
      console.log('获取token');
      if (res.data.token) {
        //重新保存token
        localStorage.setItem('token', res.data.token);
        //需要重新执行
        instance(config);
      } else {
        window.location.reload();
      }
    })
    .catch((error) => {
      window.location.reload();
    });
}

export default instance;
