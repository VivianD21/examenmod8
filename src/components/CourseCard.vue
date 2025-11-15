<template>
  <BCard class="course-card h-100">
    <BCardImg 
      :src="course.img" 
      :alt="course.nombre"
      top
      class="course-image"
    />
    <BCardBody class="d-flex flex-column">
      <BCardTitle class="card-title">{{ course.nombre }}</BCardTitle>
      <BCardText class="card-text flex-grow-1">
        <strong>Código:</strong> {{ course.codigo }}<br>
        <strong>Descripción:</strong> {{ course.descripcion }}<br>
        <strong>Duración:</strong> {{ course.duracion }}<br>
        <strong>Precio:</strong> ${{ formatPrice(course.precio) }}<br>
        <strong>Cupos:</strong> {{ course.cupos }}<br>
        <strong>Inscritos:</strong> {{ course.inscritos }}
      </BCardText>
      
      <div class="mt-auto">
        <BBadge 
          :variant="course.estado ? 'success' : 'secondary'"
          class="mb-2"
        >
          {{ course.estado ? 'Activo' : 'Inactivo' }}
        </BBadge>
        
        <BProgressBar 
          :value="inscriptionPercentage" 
          :max="100"
          class="mb-2"
          height="8px"
        />
        
        <small class="text-muted">
          {{ inscriptionPercentage }}% de cupos ocupados
        </small>
      </div>
    </BCardBody>
  </BCard>
</template>

<script>
import { BCard, BCardImg, BCardBody, BCardTitle, BCardText, BBadge, BProgressBar } from 'bootstrap-vue-next'
import { computed } from 'vue'

export default {
  name: 'CourseCard',
  components: {
    BCard,
    BCardImg, 
    BCardBody,
    BCardTitle,
    BCardText,
    BBadge,
    BProgressBar
  },
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const inscriptionPercentage = computed(() => {
      const cupos = Number(props.course.cupos) || 0
      const inscritos = Number(props.course.inscritos) || 0
      if (cupos === 0) return 0
      return Math.round((inscritos / cupos) * 100)
    })

    const formatPrice = (price) => {
      const p = Number(price) || 0
      return new Intl.NumberFormat('es-CL', {
        style: 'decimal',
        minimumFractionDigits: 0
      }).format(p)
    }

    return {
      inscriptionPercentage,
      formatPrice
    }
  }
}
</script>

<style scoped>
:root{
  --pastel-pink: #FFD7E2;
  --card-border: #e6d6dc;
}

/* Card */
.course-card {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  border: 1px solid var(--card-border);
  background-color: var(--pastel-pink);
  border-radius: 10px;
  overflow: hidden;
}

/* Hover lift */
.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* Image */
.course-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: #f8f9fa;
}

/* Card body / title / text */
.card-body {
  padding: 1rem 1rem;
}

.card-title {
  color: #222;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
}

.card-text {
  font-size: 0.92rem;
  line-height: 1.45;
  color: #333;
}

/* Progress & badge spacing */
.mb-2 {
  margin-bottom: 0.5rem !important;
}

/* Ensure the card stretches to equal heights inside a grid */
.h-100 {
  height: 100%;
}
</style>
