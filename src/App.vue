<script setup>
import { RouterView } from 'vue-router'
import { BContainer, BModal } from 'bootstrap-vue-next'
import NavBar from './components/NavBar.vue'
import { useWelcomeToast } from '@/composables/useWelcomeToast'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { showWelcome, toastBody, onToastHidden } = useWelcomeToast()
const modalTitle = 'Sesión iniciada'


import { onMounted } from 'vue'
onMounted(() => {
  if (!auth.isAuthReady) {
    auth.initAuthStateListener()
  }
})



</script>

<template>
  <div id="app">
    <NavBar />
    <BContainer>
      <div v-if="!auth.isAuthReady" class="py-5 text-center text-muted">
        Cargando sesión…
      </div>
      <RouterView v-else />
    </BContainer>

    <BModal
      v-model="showWelcome"
      :title="modalTitle"
      ok-only
      ok-title="Entendido"
      @hidden="onToastHidden"
    >
      <p class="mb-0">{{ toastBody }}</p>
    </BModal>
  </div>
</template>