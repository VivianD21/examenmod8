<template>
  <nav class="modern-navbar">
    <div class="navbar-container">
      <!-- Logo/Brand -->
      <div class="navbar-brand" @click="$router.push('/')">
        <div class="brand-icon">AWO</div>
        <span class="brand-text">Courses</span>
      </div>

      <!-- Navigation Links -->
      <div v-if="isAuthenticated" class="navbar-nav">
        <button 
          class="nav-link" 
          :class="{ active: $route.path === '/' }"
          @click="$router.push('/')"
        >
          Inicio
        </button>
        <button 
          class="nav-link" 
          :class="{ active: $route.path === '/admin' }"
          @click="$router.push('/admin')"
        >
          Administrar
        </button> 


      </div>

      <!-- User Section -->
      <div v-if="isAuthenticated" class="navbar-user">
        <div class="user-info">
          <div class="user-avatar"></div>
          <span class="user-email" data-cy="user-email">{{ currentUser?.email }}</span>
        </div>
        <button 
          class="logout-btn"
          @click="handleLogout"
          :disabled="isLoading"
          data-cy="logout-btn"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          <span v-else>Salir</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const currentUser = computed(() => authStore.currentUser)
    const isLoading = computed(() => authStore.isLoading)
    


    const handleLogout = async () => {
      const result = await authStore.logoutUser()
      if (result.success) {
        router.push('/login')
      }
    }

    const navigateToAdmin = () => {
      console.log('Navegando a /admin...')
      console.log('Usuario autenticado:', isAuthenticated.value)
      console.log('Ruta actual:', router.currentRoute.value.path)
      router.push('/admin').then(() => {
        console.log('Navegación completada a:', router.currentRoute.value.path)
      }).catch(error => {
        console.error('Error en navegación:', error)
      })
    }

    return {
      isAuthenticated,
      currentUser,
      isLoading,
      handleLogout,
      navigateToAdmin
    }
  }
}
</script>

<style scoped>
.modern-navbar {
  background: linear-gradient(135deg, #ec1414 30%, #380202 90%, #f5a6a6 5%);
  box-shadow: 0 2px 12px rgba(33, 150, 243, 0.15);
  padding: 0;
  margin-bottom: 1rem;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  flex-wrap: nowrap;
  gap: 1rem;
  min-height: 70px;
}


/* Brand/Logo */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  color: white;
  text-decoration: none;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.brand-icon {
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  width: 56px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.brand-text {
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Navigation Links */
.navbar-nav {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.25rem;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  white-space: nowrap;
}

.nav-link {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* User Section */
.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.user-avatar {
  background: rgba(255, 255, 255, 0.3);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
  position: relative;
}

.user-avatar::before {
  content: '';
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
}

.user-email {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  background: linear-gradient(45deg, #790808, #f10d0d);
  border: none;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 3px 10px rgba(238, 90, 36, 0.3);
}

.logout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(238, 90, 36, 0.4);
}

.logout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
    flex-wrap: nowrap;
  }
  
  .brand-text {
    font-size: 1.2rem;
  }
  
  .user-email {
    max-width: 120px;
  }
  
  .navbar-nav {
    gap: 0.2rem;
    padding: 0.2rem;
    flex-direction: row;
  }
  
  .nav-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0.5rem;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  
  .navbar-nav {
    gap: 0.15rem;
    padding: 0.15rem;
    flex-direction: row;
    flex-shrink: 0;
  }
  
  .nav-link, .logout-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .brand-text {
    font-size: 1.1rem;
  }
  
  .user-email {
    max-width: 100px;
    font-size: 0.8rem;
  }
}
</style>