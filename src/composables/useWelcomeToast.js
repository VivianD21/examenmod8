// src/composables/useWelcomeToast.js
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useWelcomeToast () {
  const auth = useAuthStore()
  const showWelcome = ref(false)
  const toastTitle = 'Sesión iniciada'
  const userEmail = computed(() => auth.currentUser?.email || 'usuario')
  const toastBody = computed(() =>
    `Bienvenido, ${userEmail.value}. Ingreso detectado por onAuthStateChanged.`
  )

  watch(() => auth.justLoggedInAt, (ts) => {
    if (ts && auth.sessionOrigin === 'onAuthStateChanged') {
      showWelcome.value = true
    }
  })

  function onToastHidden () {
    showWelcome.value = false
    auth.resetJustLogged()
  }

  return { showWelcome, toastTitle, toastBody, onToastHidden }
}