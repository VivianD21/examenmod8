import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,

    authReady: false, 
    justLoggedInAt: null,     
    sessionOrigin: null,       
    _initPromise: null,        
    _lastToastTs: 0            
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isAuthReady: (state) => state.authReady
  },

  actions: {
    initAuthStateListener () {
      if (this._initPromise) return this._initPromise

      this.loading = true

      this._initPromise = new Promise((resolve) => {
        let firstEmission = true

        onAuthStateChanged(auth, (user) => {
          const prevUser = this.user
          this.user = user

          if (prevUser == null && user != null) {
            const uid = user.uid
            const currentSignIn = user.metadata?.lastSignInTime || ''
            const key = `welcomed:${uid}`
            const lastWelcomed = localStorage.getItem(key)

            if (lastWelcomed !== currentSignIn) {
              this.sessionOrigin = 'onAuthStateChanged'
              const now = Date.now()
              if (now - this._lastToastTs > 1000) {
                this.justLoggedInAt = now
                this._lastToastTs = now
              }
              localStorage.setItem(key, currentSignIn)
            }
          }

          if (firstEmission) {
            this.authReady = true
            firstEmission = false
            this.loading = false
            resolve(user)
          }
        })
      })

      return this._initPromise
    },

    async registerUser (email, password) {
      this.loading = true
      this.error = null
      try {
        this.sessionOrigin = 'manual'
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return { success: true, user: userCredential.user }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async loginUser (email, password) {
      this.loading = true
      this.error = null
      try {
        this.sessionOrigin = 'manual'
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return { success: true, user: userCredential.user }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async logoutUser () {
      this.loading = true
      this.error = null
      try {
        await signOut(auth)
        this.user = null
        this.sessionOrigin = null
        this.justLoggedInAt = null
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    clearError () {
      this.error = null
    },

    resetJustLogged () {
      this.justLoggedInAt = null
    }
  }
})