import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const hasQiankunPowered = !!window.__POWERED_BY_QIANKUN__
export const history = createWebHistory(hasQiankunPowered ? '/micro-app' : process.env.BASE_URL)
const router = createRouter({
  history,
  routes
})

export default router
