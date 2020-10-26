/*
 * @Author: your name
 * @Date: 2020-10-23 14:08:59
 * @LastEditTime: 2020-10-26 18:25:19
 * @LastEditors: your name
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
