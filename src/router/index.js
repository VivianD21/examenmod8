import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/edit/:id',
      name: 'edit-course',
      component: () => import('@/views/EditCourseView.vue'),
      meta: { requiresAuth: true },
      props: true
    }
  ]
})

router.beforeEach(async (to, from) => {
  const auth = useAuthStore()

  if (!auth.isAuthReady) {
    await auth.initAuthStateListener()
  }

  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth)
  const requiresGuest = to.matched.some(r => r.meta?.requiresGuest)

  if (requiresAuth && !auth.isAuthenticated) {
    if (to.name !== 'login') {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
        replace: true
      }
    }
    return true
  }

  if (requiresGuest && auth.isAuthenticated) {
    if (to.name !== 'home') {
      return { name: 'home', replace: true }
    }
    return true
  }

  return true
})

export default router
