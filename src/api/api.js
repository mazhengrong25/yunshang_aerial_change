/*
 * @Author: your name
 * @Date: 2020-10-29 10:30:51
 * @LastEditTime: 2020-10-29 11:20:41
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \positiond:\aerial\yunshang_aerial_change\src\api\api.js
 */
import axios from 'axios';

axios.defaults.baseURL = 'http://192.168.0.27:5005';

let instance = axios.create({
  // timeout: 1000 * 12,
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
    console.log('获取config',response.config)
    if(!response.config.headers.Authorization){
      refresh(response.config);
    }
    return response;
  },
  (error) => {
    console.log('response error :' + error);
    if (error.response) {
      let config = error.config;
      refresh(config);
      return;
    }
    return Promise.reject(error); // 返回接口返回的错误信息
  }
);

// 获取token
function refresh(config) {
  console.log('获取token')
  axios
    .get('api/token/authenticate')
    .then((res) => {
      if (res.data.token) {
        //重新保存token
        console.log(res.data.token)
        localStorage.setItem('token', res.data.token);
        //需要重新执行
        axios(config);
      } else {
        window.location.reload();
      }
    })
    .catch((error) => {
      window.location.reload();
    });
}

export default instance;
