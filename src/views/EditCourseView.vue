<template>
  <div>
    <!-- Header -->
    <BRow class="mb-4">
      <BCol>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h2 mb-1">Editar Curso</h1>
            <p class="text-muted mb-0">Modifica la información del curso</p>
          </div>
          <BButton 
            variant="outline-secondary" 
            @click="$router.push('/admin')"
          >
            ← Volver
          </BButton>
        </div>
      </BCol>
    </BRow>

    <!-- Loading -->
    <div v-if="coursesStore.isLoading" class="text-center my-5">
      <BSpinner variant="primary" class="me-2"></BSpinner>
      <span>Cargando curso...</span>
    </div>

    <!-- Error -->
    <BAlert v-if="coursesStore.getError" variant="danger" class="mb-4">
      Error: {{ coursesStore.getError }}
    </BAlert>

    <!-- Formulario -->
    <BCard v-if="editCourse && !coursesStore.isLoading">
      <BCardBody>
        <CourseForm 
          :course="editCourse" 
          @update-course="updateEditCourse"
        />
      </BCardBody>
      
      <BCardFooter class="text-end">
        <BButton 
          variant="secondary" 
          class="me-2"
          @click="$router.push('/admin')"
        >
          Cancelar
        </BButton>
        <BButton 
          variant="primary" 
          @click="confirmUpdate"
          :disabled="!isFormValid || coursesStore.isLoading"
        >
          Actualizar Curso
        </BButton>
      </BCardFooter>
    </BCard>

    <!-- Error curso no encontrado -->
    <BAlert v-if="!editCourse && !coursesStore.isLoading && !coursesStore.getError" variant="warning">
      <h4 class="alert-heading">Curso no encontrado</h4>
      <p>El curso que intentas editar no existe o ha sido eliminado.</p>
      <hr>
      <BButton variant="outline-warning" @click="$router.push('/admin')">
        Volver a Administración
      </BButton>
    </BAlert>

    <!-- Modal Confirmar Actualización -->
    <BModal 
      v-model="showConfirmUpdate" 
      title="Confirmar Actualización"
      centered
    >
      <p>¿Deseas actualizar este curso?</p>
      <template #footer>
        <BButton variant="secondary" @click="showConfirmUpdate = false">
          Cancelar
        </BButton>
        <BButton 
          variant="primary" 
          @click="updateCourse"
          :disabled="coursesStore.isLoading"
        >
          <span v-if="coursesStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
          Actualizar
        </BButton>
      </template>
    </BModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  BRow, 
  BCol, 
  BButton, 
  BSpinner, 
  BAlert, 
  BCard,
  BCardBody,
  BCardFooter,
  BModal
} from 'bootstrap-vue-next'
import { useCoursesStore } from '../stores/courses'
import CourseForm from '../components/CourseForm.vue'

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()

// Variables reactivas
const unsubscribe = ref(null)
const showConfirmUpdate = ref(false)
const editCourse = ref(null)
const originalCourse = ref(null)

// Computed
const isFormValid = computed(() => {
  if (!editCourse.value) return false
  
  return editCourse.value.codigo && 
         editCourse.value.nombre && 
         editCourse.value.descripcion &&
         editCourse.value.precio &&
         editCourse.value.duracion &&
         editCourse.value.cupos &&
         editCourse.value.img
})

// Métodos
const updateEditCourse = (updatedCourse) => {
  editCourse.value = { ...updatedCourse }
}

const confirmUpdate = () => {
  showConfirmUpdate.value = true
}

const updateCourse = async () => {
  if (!editCourse.value || !originalCourse.value) return

  const courseData = {
    ...editCourse.value,
    precio: parseInt(editCourse.value.precio),
    cupos: parseInt(editCourse.value.cupos),
    inscritos: parseInt(editCourse.value.inscritos)
  }

  const result = await coursesStore.updateCourse(originalCourse.value.id, courseData)
  
  showConfirmUpdate.value = false
  
  if (result.success) {
    router.push('/admin')
  }
}

// Buscar el curso cuando cambien los cursos en el store
watch(() => coursesStore.allCourses, (courses) => {
  if (courses.length > 0 && route.params.id) {
    const course = courses.find(c => c.id === route.params.id)
    if (course) {
      originalCourse.value = course
      editCourse.value = { ...course }
    }
  }
}, { immediate: true })

// Lifecycle hooks
onMounted(() => {
  // Si no hay cursos cargados, inicializar el listener
  if (coursesStore.allCourses.length === 0) {
    unsubscribe.value = coursesStore.initCoursesListener()
  } else {
    // Si ya hay cursos, buscar el curso directamente
    const course = coursesStore.allCourses.find(c => c.id === route.params.id)
    if (course) {
      originalCourse.value = course
      editCourse.value = { ...course }
    }
  }
})

onUnmounted(() => {
  if (unsubscribe.value) {
    unsubscribe.value()
  }
})
</script>

<style scoped>
.h2 {
  color: #007bff;
}
</style>