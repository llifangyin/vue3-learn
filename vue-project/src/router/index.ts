import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/computed',
      name: 'computed',
      component: () => import('../views/Computed.vue')
    },
    
    {
      path: '/lifecycle',
      name: 'lifecycle',
      component: () => import('../views/lifecycle.vue')
    },
    {
      path: '/watch',
      name: 'watch',
      component: () => import('../views/watch.vue')
    },
    {
      path: '/templateRefs',
      name: 'templateRefs',
      component: () => import('../views/templateRefs.vue')
    },
    {
      path: '/component',
      name: 'component',
      component: () => import('../views/component.vue')
    },
    {
      path: '/pinia',
      name: 'pinia',
      component: () => import('../views/pinia.vue')
    },
    
    
    
  ]
})

export default router
