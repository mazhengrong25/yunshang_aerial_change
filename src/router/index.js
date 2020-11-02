/*
 * @Author: your name
 * @Date: 2020-10-23 14:08:59
 * @LastEditTime: 2020-10-30 14:18:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \positiond:\aerial\yunshang_aerial_change\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import(/* webpackChunkName: "Index" */ '../views/index.vue')
  },
  {
    path: '/profit',
    name: '来源所属利润中心管理',
    component: () => import(/* webpackChunkName: "Profit" */ '../views/profit.vue')
  },
  {
    path: '/dictionary',
    name: '数据字典',
    component: () => import(/* webpackChunkName: "dictionary" */ '../views/dictionary.vue')
  },
  {
    path: '/rule',
    name: '订单规则匹配管理',
    component: () => import(/* webpackChunkName: "rule" */ '../views/rule.vue')
  },
  {
    path: '/dynamicLibrary',
    name: '公共航变动态库',
    component: () => import(/* webpackChunkName: "dynamicLibrary" */ '../views/dynamicLibrary.vue')
  },
   {
    path: '/changeNotice',
    name: '航变通知旅客',
    component: () => import(/* webpackChunkName: "changeNotice" */ '../views/changeNotice.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
