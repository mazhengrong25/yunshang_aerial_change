import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
import router from './router'

Vue.use(Antd);


Vue.config.productionTip = false

import axios from '@/api/api'; // 导入http中创建的axios实例
Vue.prototype.$axios = axios;

import 'ant-design-vue/lib/locale-provider/zh_CN';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
