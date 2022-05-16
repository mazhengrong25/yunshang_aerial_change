/*
 * @Author: your name
 * @Date: 2020-10-23 14:08:59
 * @LastEditTime: 2020-10-29 16:38:10
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \positiond:\aerial\yunshang_aerial_change\src\main.js
 */
import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
import router from './router';

Vue.use(Antd);

import axios from '@/api/api'; // 导入http中创建的axios实例
Vue.prototype.$axios = axios;

import moment from 'moment';
Vue.prototype.$moment = moment;

Vue.config.productionTip = false;

import 'ant-design-vue/lib/locale-provider/zh_CN';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
