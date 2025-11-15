<template>
  <BRow class="justify-content-center mt-5">
    <BCol md="6" lg="4">
      <BCard>
        <BCardHeader>
          <h3 class="text-center mb-0">Crear Cuenta</h3>
        </BCardHeader>
        <BCardBody>
          <!-- Mostrar errores -->
          <BAlert 
            v-if="authStore.getError" 
            variant="danger" 
            dismissible
            @dismissed="authStore.clearError()"
          >
            {{ authStore.getError }}
          </BAlert>

          <BForm @submit.prevent="handleRegister">
            <BFormGroup 
              id="email-group" 
              class="mb-3"
              label="Correo Electrónico:" 
              label-for="email"
            >
              <BFormInput
                id="email"
                v-model="email"
                type="email"
                placeholder="Ingresa tu correo"
                required
                :disabled="authStore.isLoading"
              />
            </BFormGroup>

            <BFormGroup 
              id="password-group" 
              class="mb-3"
              label="Contraseña:" 
              label-for="password"
            >
              <BFormInput
                id="password"
                v-model="password"
                type="password"
                placeholder="Ingresa una contraseña (mín. 6 caracteres)"
                required
                minlength="6"
                :disabled="authStore.isLoading"
              />
            </BFormGroup>

            <BFormGroup 
              id="confirm-password-group" 
              class="mb-3"
              label="Confirmar Contraseña:" 
              label-for="confirmPassword"
            >
              <BFormInput
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                required
                :disabled="authStore.isLoading"
              />
            </BFormGroup>

            <BButton 
              type="submit" 
              variant="success" 
              class="w-100 mb-3"
              :disabled="authStore.isLoading || password !== confirmPassword"
            >
              <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Crear Cuenta
            </BButton>
          </BForm>

          <div class="text-center">
            <p class="mb-0">¿Ya tienes cuenta?</p>
            <BButton 
              variant="link" 
              @click="$router.push('/login')"
              :disabled="authStore.isLoading"
            >
              Inicia sesión aquí
            </BButton>
          </div>
        </BCardBody>
      </BCard>
    </BCol>
  </BRow>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  BRow, 
  BCol, 
  BCard, 
  BCardHeader, 
  BCardBody, 
  BForm, 
  BFormGroup, 
  BFormInput, 
  BButton, 
  BAlert 
} from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Variables reactivas
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Función de registro
const handleRegister = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    return
  }

  if (password.value !== confirmPassword.value) {
    // Podrías mostrar un error aquí
    return
  }

  if (password.value.length < 6) {
    return
  }

  const result = await authStore.registerUser(email.value, password.value)
  
  if (result.success) {
    router.push('/')
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>