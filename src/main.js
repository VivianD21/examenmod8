import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/assets/main.css'


import 'bootstrap/dist/css/bootstrap.css'
import { createBootstrap } from 'bootstrap-vue-next'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import { useAuthStore } from '@/stores/auth' // ajusta @ si no tienes alias

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createBootstrap())


const auth = useAuthStore()
auth.initAuthStateListener()   

app.mount('#app')