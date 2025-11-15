<template>
  <div class="home-container">
    <!-- Header -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">AWO courses</h1>
        <p class="hero-subtitle">
          Plataforma de cursos de programación y desarrollo web
        </p>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Loading -->
      <div v-if="coursesStore.isLoading" class="loading-section">
        <div class="loading-spinner-large"></div>
        <p class="loading-text">Cargando cursos...</p>
      </div>

      <!-- Error -->
      <div v-if="coursesStore.getError" class="error-section">
        <div class="error-content">
          <div>
            <h4>Error al cargar los cursos</h4>
            <p>{{ coursesStore.getError }}</p>
          </div>
        </div>
      </div>

      <!-- Cursos -->
      <div v-if="!coursesStore.isLoading && !coursesStore.getError">
        <!-- Filtros -->
        <div class="filters-section">
          <div class="filters-container">
            <h3 class="filters-title">
              Filtrar cursos:
            </h3>
            <div class="filter-buttons">
              <button 
                v-for="option in filterOptions"
                :key="option.value"
                :class="['filter-btn', { active: filterType === option.value }]"
                @click="filterType = option.value"
              >
                {{ option.text }}
              </button>
            </div>
          </div>
        </div>

        <!-- Grid de cursos -->
        <div v-if="filteredCourses.length > 0" class="courses-grid">
          <CourseCard 
            v-for="course in filteredCourses" 
            :key="course.id"
            :course="course" 
          />
        </div>

        <!-- No hay cursos -->
        <div v-else class="no-courses-section">
          <div class="no-courses-content">
            <h4 class="no-courses-title">No hay cursos disponibles</h4>
            <p class="no-courses-text">
              {{ filterType === 'active' ? 'No hay cursos activos en este momento.' : 'No se encontraron cursos.' }}
            </p>
            <button class="add-course-btn" @click="$router.push('/admin')">
              Agregar Cursos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCoursesStore } from '../stores/courses'
import CourseCard from '../components/CourseCard.vue'

const coursesStore = useCoursesStore()

// Variables reactivas
const filterType = ref('all')
const unsubscribe = ref(null)

// Opciones de filtro
const filterOptions = [
  { text: 'Todos', value: 'all' },
  { text: 'Solo Activos', value: 'active' }
]

// Computed para filtrar cursos
const filteredCourses = computed(() => {
  if (filterType.value === 'active') {
    return coursesStore.activeCourses
  }
  return coursesStore.allCourses
})

// Lifecycle hooks
onMounted(() => {
  // Inicializar listener en tiempo real
  unsubscribe.value = coursesStore.initCoursesListener()
})

onUnmounted(() => {
  // Limpiar listener
  if (unsubscribe.value) {
    unsubscribe.value()
  }
})
</script>

<style scoped>
/* Container Principal */
.home-container {
  min-height: 90vh;
  background: #f8f9fa;
}

/* Hero Section */
.hero-section {
  min-height: 120px; 
  padding: 1.25rem 1rem;
  display: flex;
  align-items: center;
  background: white;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}



.hero-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #500505, #f187a2, #f71313);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(33, 150, 243, 0.1);
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #8a526e;
  font-weight: 400;
  margin: 0;
  opacity: 0.9;
}

/* Content Wrapper */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

/* Loading Section */
.loading-section {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(58, 8, 25, 0.2);
  border-radius: 50%;
  border-top-color: #970a11;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.2rem;
  color: #740b14;
  font-weight: 500;
}

/* Error Section */
.error-section {
  margin: 2rem 0;
}

.error-content {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(239, 83, 80, 0.1);
}

.error-content h4 {
  color: #c62828;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.error-content p {
  color: #d32f2f;
  margin: 0;
  font-weight: 500;
}

/* Filters Section */
.filters-section {
  margin-bottom: 3rem;
}

.filters-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
}

.filters-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #920927;
  margin-bottom: 1.5rem;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(228, 10, 46, 0.103);
  border: 2px solid #550606;
  color: #d21919;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.filter-btn:hover {
  background: rgba(255, 63, 79, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(53, 5, 7, 0.2);
}

.filter-btn.active {
  background: linear-gradient(135deg, #ec1a1a, #83112a);
  color: white;
  box-shadow: 0 4px 16px rgba(129, 10, 16, 0.3);
}

/* Courses Grid */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

/* No Courses Section */
.no-courses-section {
  text-align: center;
  padding: 4rem 2rem;
}

.no-courses-content {
  background: white;
  border-radius: 8px;
  padding: 3rem 2rem;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
}



.no-courses-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ee164c;
  margin-bottom: 1rem;
}

.no-courses-text {
  color: #9b1c1c;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.add-course-btn {
  background: linear-gradient(135deg, #f32121, #740909);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(243, 33, 96, 0.3);
}

.add-course-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(187, 20, 56, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .content-wrapper {
    padding: 0 1rem 3rem;
  }
  
  .filters-container {
    padding: 1.5rem;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .no-courses-content {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-icon {
    font-size: 3rem;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .filter-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>