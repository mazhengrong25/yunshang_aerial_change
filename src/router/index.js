/*
 * @Author: your name
 * @Date: 2020-10-23 14:08:59
 * @LastEditTime: 2020-10-27 17:08:43
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
    component: () => import(/* webpackChunkName: "index" */ '../views/index.vue')
  },
  {
    path: '/profit',
    name: 'Profit',
    component: () => import(/* webpackChunkName: "index" */ '../views/profit.vue')
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    component: () => import(/* webpackChunkName: "index" */ '../views/dictionary.vue')
  },
  {
    path: '/rule',
    name: 'rule',
    component: () => import(/* webpackChunkName: "index" */ '../views/rule.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
