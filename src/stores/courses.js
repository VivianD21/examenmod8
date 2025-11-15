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
import { db } from '../firebase/config'

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
      console.log('[Store:courses] initCoursesListener called')
      if (this._unsubscribe) {
        console.log('[Store:courses] listener already active')
        return this._unsubscribe
      }

      this.loading = true
      const coursesCollection = collection(db, 'courses')

      const unsubscribe = onSnapshot(coursesCollection, (snapshot) => {
        console.log('[Store:courses] onSnapshot triggered, docs count:', snapshot.docs.length)
        this.courses = snapshot.docs.map(d => {
          const data = d.data()
          console.log('[Store:courses] doc fetched:', d.id, data)
          return { id: d.id, ...data }
        })
        this.loading = false
      }, (error) => {
        console.error('[Store:courses] onSnapshot error', error)
        this.error = error.message
        this.loading = false
      })

      this._unsubscribe = unsubscribe
      console.log('[Store:courses] listener registered')
      return this._unsubscribe
    },

    // detener listener manualmente
    stopListener() {
      console.log('[Store:courses] stopListener called')
      if (this._unsubscribe && typeof this._unsubscribe === 'function') {
        try {
          this._unsubscribe()
          console.log('[Store:courses] listener unsubscribed successfully')
        } catch (e) {
          console.warn('[Store:courses] error unsubscribing', e)
        } finally {
          this._unsubscribe = null
        }
      }
    },

    // one-time fetch
    async fetchCourses() {
      console.log('[Store:courses] fetchCourses called')
      this.loading = true
      this.error = null
      try {
        const coursesCollection = collection(db, 'courses')
        const snapshot = await getDocs(coursesCollection)
        console.log('[Store:courses] fetchCourses got docs:', snapshot.docs.length)
        this.courses = snapshot.docs.map(d => {
          const data = d.data()
          console.log('[Store:courses] fetched doc:', d.id, data)
          return { id: d.id, ...data }
        })
      } catch (error) {
        console.error('[Store:courses] fetchCourses error', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // add course (with optimistic local update if listener not active)
    async addCourse(courseData) {
      console.log('[Store:courses] addCourse called ->', courseData)
      this.loading = true
      this.error = null
      try {
        const coursesCollection = collection(db, 'courses')
        const docRef = await addDoc(coursesCollection, courseData)
        console.log('[Store:courses] addDoc success id=', docRef.id)

        if (!this._unsubscribe) {
          this.courses.unshift({ id: docRef.id, ...courseData })
          console.log('[Store:courses] optimistic local push of new course', docRef.id)
          console.log('[Store:courses] courses after optimistic push:', this.courses)
        } else {
          console.log('[Store:courses] listener active, skipping optimistic update')
        }

        return { success: true, id: docRef.id }
      } catch (error) {
        console.error('[Store:courses] addDoc error', error)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
        console.log('[Store:courses] addCourse finished')
      }
    },

    // update course (with optimistic local update if listener not active)
    async updateCourse(courseId, courseData) {
      console.log('[Store:courses] updateCourse called ->', courseId, courseData)
      this.loading = true
      this.error = null
      try {
        const courseRef = doc(db, 'courses', courseId)
        await updateDoc(courseRef, courseData)
        console.log('[Store:courses] updateDoc success', courseId)

        if (!this._unsubscribe) {
          const idx = this.courses.findIndex(c => c.id === courseId)
          if (idx !== -1) this.courses[idx] = { ...this.courses[idx], ...courseData }
          console.log('[Store:courses] optimistic local update applied', courseId)
          console.log('[Store:courses] courses after optimistic update:', this.courses)
        } else {
          console.log('[Store:courses] listener active, skipping optimistic update')
        }

        return { success: true }
      } catch (error) {
        console.error('[Store:courses] updateDoc error', error)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
        console.log('[Store:courses] updateCourse finished')
      }
    },

    // delete course (with optimistic local delete if listener not active)
    async deleteCourse(courseId) {
      console.log('[Store:courses] deleteCourse called ->', courseId)
      this.loading = true
      this.error = null
      try {
        const courseRef = doc(db, 'courses', courseId)
        await deleteDoc(courseRef)
        console.log('[Store:courses] deleteDoc success', courseId)

        if (!this._unsubscribe) {
          this.courses = this.courses.filter(c => c.id !== courseId)
          console.log('[Store:courses] optimistic local delete applied', courseId)
          console.log('[Store:courses] courses after optimistic delete:', this.courses)
        } else {
          console.log('[Store:courses] listener active, skipping optimistic delete')
        }

        return { success: true }
      } catch (error) {
        console.error('[Store:courses] deleteDoc error', error)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
        console.log('[Store:courses] deleteCourse finished')
      }
    },

    clearError() {
      console.log('[Store:courses] clearError called')
      this.error = null
    }
  }
})
