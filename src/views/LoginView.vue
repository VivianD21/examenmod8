
<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header Section -->
      <div class="login-header">
        <div class="login-icon">AW</div>
        <h2 class="login-title">Iniciar Sesión</h2>
        <p class="login-subtitle">Accede a tu cuenta de AdWeb Online</p>
      </div>

      <!-- Error Alert -->
      <div 
        v-if="authStore.getError" 
        class="error-alert alert alert-danger"
        role="alert"
      >
        <div class="error-content">
          <span class="error-icon">!</span>
          <span class="error-message">{{ authStore.getError }}</span>
          <button class="error-close" @click="authStore.clearError()">×</button>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">
            <span class="label-icon">@</span>
            Correo Electrónico
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="tu@email.com"
            required
            :disabled="authStore.isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <span class="label-icon">*</span>
            Contraseña
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Tu contraseña"
            required
            :disabled="authStore.isLoading"
          />
        </div>

        <button 
          type="submit" 
          class="login-btn"
          :disabled="authStore.isLoading"
        >
          <span v-if="authStore.isLoading" class="loading-spinner"></span>
          {{ authStore.isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- Register Link -->
      <div class="register-section">
        <p class="register-text">¿No tienes cuenta?</p>
        <button 
          class="register-link" 
          @click="$router.push('/register')"
          :disabled="authStore.isLoading"
        >
          Regístrate aquí
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Variables reactivas
const email = ref('')
const password = ref('')

// Función de login
const handleLogin = async () => {
  if (!email.value || !password.value) {
    return
  }

  const result = await authStore.loginUser(email.value, password.value)
  
  if (result.success) {
    router.push('/')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f8f9fa;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  width: 100%;
  max-width: 420px;
  padding: 3rem 2.5rem;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header Section */
.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-icon {
  font-size: 2rem;
  font-weight: 800;
  color: #df0c0c;
  background: linear-gradient(135deg, #e3f2fd, #f3bec2);
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  border: 2px solid rgba(243, 130, 130, 0.801);
  box-shadow: 0 4px 12px rgba(233, 169, 172, 0.15);
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #546e7a;
  font-size: 1rem;
  font-weight: 400;
  margin: 0;
}

/* Error Alert */
.error-alert {
  margin-bottom: 2rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 20%, 40%, 60%, 80%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
}

.error-content {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  border: 1px solid #ef5350;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.error-icon {
  font-size: 1.2rem;
}

.error-message {
  flex: 1;
  color: #c62828;
  font-weight: 500;
  font-size: 0.9rem;
}

.error-close {
  background: none;
  border: none;
  color: #c62828;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.error-close:hover {
  background: rgba(198, 40, 40, 0.1);
}

/* Form Styles */
.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 2rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  color: #495057;
}

.form-input:focus {
  outline: none;
  border-color: #2196f3;
  background: white;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: #90a4ae;
}

/* Login Button */
.login-btn {
  width: 100%;
  background: #e70e0e;
  border: none;
  color: white;
  padding: 1.25rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(59, 6, 6, 0.2);
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-btn:hover:not(:disabled)::before {
  left: 100%;
}

.login-btn:hover:not(:disabled) {
  background: #8b0505;
  box-shadow: 0 4px 12px rgba(54, 9, 19, 0.3);
}

.login-btn:active {
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.btn-icon {
  font-size: 1.2rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Register Section */
.register-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
}

.register-text {
  color: #546e7a;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.register-link {
  background: transparent;
  border: 2px solid #7a0909;
  color: #f32133;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.register-link:hover:not(:disabled) {
  background: #b90f1d;
  color: white;
}

.register-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
    min-height: 90vh;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .login-title {
    font-size: 1.75rem;
  }
  
  .form-input, .login-btn {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem 1rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
  
  .login-icon {
    font-size: 3rem;
  }
}
</style>