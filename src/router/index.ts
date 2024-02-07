import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// Import middlewares
import Auth from '@/middlewares/auth'
import Guest from '@/middlewares/guest'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        auth: true
      },
      beforeEnter: Auth
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        auth: 'guest'
      },
      component: () => import('../views/RegisterView.vue'),
      beforeEnter: Guest
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        auth: 'guest'
      },
      beforeEnter: Guest
    }
  ]
})

export default router
