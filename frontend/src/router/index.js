import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layouts
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayoutSimple.vue'

// Auth Views
import Login from '../views/auth/LoginSimple.vue'
import Register from '../views/auth/Register.vue'

// Dashboard Views
import Dashboard from '../views/DashboardSimple.vue'
import Projects from '../views/Projects.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import Defects from '../views/Defects.vue'
import DefectDetail from '../views/DefectDetail.vue'
import CreateDefect from '../views/CreateDefect.vue'
import Reports from '../views/Reports.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: { requiresGuest: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: Register,
        meta: { requiresGuest: true }
      }
    ]
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'projects',
        name: 'Projects',
        component: Projects
      },
      {
        path: 'projects/:id',
        name: 'ProjectDetail',
        component: ProjectDetail,
        props: true
      },
      {
        path: 'defects',
        name: 'Defects',
        component: Defects
      },
      {
        path: 'defects/create',
        name: 'CreateDefect',
        component: CreateDefect
      },
      {
        path: 'defects/:id',
        name: 'DefectDetail',
        component: DefectDetail,
        props: true
      },
      {
        path: 'reports',
        name: 'Reports',
        component: Reports,
        meta: { requiresRoles: ['manager', 'supervisor'] }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.requiresRoles) {
    if (!authStore.user || !to.meta.requiresRoles.includes(authStore.user.role)) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router