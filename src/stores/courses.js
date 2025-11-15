import { defineStore } from 'pinia'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs
} from 'firebase/firestore'

import { db } from '@/firebase/config'




export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    loading: false,
    error: null,
    _unsubscribe: null // guarda la función de onSnapshot o null
  }),

  getters: {
    allCourses: (state) => state.courses,
    activeCourses: (state) => state.courses.filter(course => course.estado),
    getCourseByCode: (state) => (codigo) => state.courses.find(course => course.codigo === codigo),
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    hasListener: (state) => typeof state._unsubscribe === 'function'
  },

  actions: {
    // Inicializar listener en tiempo real (idempotente)
    initCoursesListener() {
      if (this._unsubscribe) return this._unsubscribe

      this.loading = true
      this.error = null

      const coursesCollection = collection(db, 'courses')

      const unsubscribe = onSnapshot(
        coursesCollection,
        (snapshot) => {
          this.courses = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          this.loading = false
        },
        (error) => {
          this.error = error?.message || String(error)
          this.loading = false
        }
      )

      this._unsubscribe = unsubscribe
      return this._unsubscribe
    },

    // Detener listener manualmente
    stopListener() {
      if (this._unsubscribe && typeof this._unsubscribe === 'function') {
        try {
          this._unsubscribe()
        } catch (e) {
          // no interrumpir flujo por error al unsubscribe
          console.warn('[Store:courses] error unsubscribing', e)
        } finally {
          this._unsubscribe = null
        }
      }
    },

    // one-time fetch (snapshot único)
    async fetchCourses() {
      this.loading = true
      this.error = null
      try {
        const coursesCollection = collection(db, 'courses')
        const snapshot = await getDocs(coursesCollection)
        this.courses = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        return { success: true }
      } catch (err) {
        this.error = err?.message || String(err)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Agregar curso (optimistic local update si no hay listener)
    async addCourse(courseData) {
      if (!courseData || typeof courseData !== 'object') {
        return { success: false, error: 'Invalid course data' }
      }

      this.loading = true
      this.error = null
      try {
        const coursesCollection = collection(db, 'courses')
        const docRef = await addDoc(coursesCollection, courseData)

        // Si no hay listener en tiempo real, mantenemos la UI sincronizada con un optimistic push
        if (!this._unsubscribe) {
          // evitar duplicados por id desconocido: usamos el id devuelto
          this.courses.unshift({ id: docRef.id, ...courseData })
        }

        return { success: true, id: docRef.id }
      } catch (err) {
        this.error = err?.message || String(err)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Actualizar curso (partial update). Devuelve { success, error }.
    async updateCourse(courseId, courseData) {
      if (!courseId) return { success: false, error: 'Missing courseId' }
      if (!courseData || typeof courseData !== 'object') return { success: false, error: 'Invalid payload' }

      this.loading = true
      this.error = null
      // guardamos snapshot local para posible rollback si hacemos optimistic update
      const idx = this.courses.findIndex(c => c.id === courseId)
      const prev = idx !== -1 ? { ...this.courses[idx] } : null

      try {
        const courseRef = doc(db, 'courses', courseId)
        await updateDoc(courseRef, courseData)

        // si no hay listener, aplicar cambio localmente
        if (!this._unsubscribe && idx !== -1) {
          this.courses[idx] = { ...this.courses[idx], ...courseData }
        }

        return { success: true }
      } catch (err) {
        // revertir si se aplicó localmente
        if (!this._unsubscribe && idx !== -1 && prev) {
          this.courses[idx] = prev
        }
        this.error = err?.message || String(err)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Toggle helper que delega en updateCourse
    async toggleCourse(courseId, newEstado) {
      return await this.updateCourse(courseId, { estado: Boolean(newEstado) })
    },

    // Eliminar curso
    async deleteCourse(courseId) {
      if (!courseId) return { success: false, error: 'Missing courseId' }

      this.loading = true
      this.error = null
      // snapshot previo para rollback
      const prevList = this._unsubscribe ? null : [...this.courses]

      try {
        const courseRef = doc(db, 'courses', courseId)
        await deleteDoc(courseRef)

        // si no hay listener, eliminar localmente
        if (!this._unsubscribe) {
          this.courses = this.courses.filter(c => c.id !== courseId)
        }

        return { success: true }
      } catch (err) {
        // rollback si hicimos cambio local sin listener
        if (!this._unsubscribe && Array.isArray(prevList)) {
          this.courses = prevList
        }
        this.error = err?.message || String(err)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})


