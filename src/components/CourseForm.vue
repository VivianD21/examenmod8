<template>
  <BForm>
    <BRow>
      <BCol md="6">
        <BFormGroup label="Código del Curso:" label-for="codigo">
          <BFormInput
            id="codigo"
            :model-value="course.codigo"
            @update:modelValue="val => updateField('codigo', val)"
            placeholder="ej: 0001"
            required
          />
        </BFormGroup>
      </BCol>

      <BCol md="6">
        <BFormGroup label="Nombre del Curso:" label-for="nombre">
          <BFormInput
            id="nombre"
            :model-value="course.nombre"
            @update:modelValue="val => updateField('nombre', val)"
            placeholder="ej: HTML"
            required
          />
        </BFormGroup>
      </BCol>
    </BRow>

    <BFormGroup label="Descripción:" label-for="descripcion">
      <BFormTextarea
        id="descripcion"
        :model-value="course.descripcion"
        @update:modelValue="val => updateField('descripcion', val)"
        placeholder="Describe el curso..."
        rows="3"
        required
      />
    </BFormGroup>

    <BRow>
      <BCol md="4">
        <BFormGroup label="Precio:" label-for="precio">
          <BInputGroup>
            <BInputGroupText>$</BInputGroupText>
            <BFormInput
              id="precio"
              type="number"
              :model-value="course.precio"
              @update:modelValue="val => updateNumber('precio', val)"
              placeholder="30000"
              min="0"
              step="1000"
              required
            />
          </BInputGroup>
        </BFormGroup>
      </BCol>

      <BCol md="4">
        <BFormGroup label="Duración:" label-for="duracion">
          <BFormInput
            id="duracion"
            :model-value="course.duracion"
            @update:modelValue="val => updateField('duracion', val)"
            placeholder="ej: 1 mes"
            required
          />
        </BFormGroup>
      </BCol>

      <BCol md="4">
        <BFormGroup label="Cupos:" label-for="cupos">
          <BFormInput
            id="cupos"
            type="number"
            :model-value="course.cupos"
            @update:modelValue="val => updateNumber('cupos', val)"
            placeholder="10"
            min="1"
            required
          />
        </BFormGroup>
      </BCol>
    </BRow>

    <BRow>
      <BCol md="6">
        <BFormGroup label="Inscritos:" label-for="inscritos">
          <BFormInput
            id="inscritos"
            type="number"
            :model-value="course.inscritos"
            @update:modelValue="val => updateNumber('inscritos', val)"
            placeholder="0"
            min="0"
          />
        </BFormGroup>
      </BCol>

      <BCol md="6">
        <BFormGroup label="Estado:" label-for="estado">
          <BFormCheckbox
            id="estado"
            :checked="Boolean(course.estado)"
            @update:checked="val => updateBoolean('estado', val)"
          >
            Curso activo
          </BFormCheckbox>
        </BFormGroup>
      </BCol>
    </BRow>

    <BFormGroup label="URL de la Imagen:" label-for="img">
      <BFormInput
        id="img"
        type="url"
        :model-value="course.img"
        @update:modelValue="val => updateField('img', val)"
        placeholder="https://ejemplo.com/imagen.png"
        required
      />
    </BFormGroup>

    <div v-if="course.img" class="text-center mt-3">
      <p class="mb-2"><strong>Vista previa:</strong></p>
      <img
        :src="course.img"
        :alt="course.nombre"
        style="max-width: 200px; max-height: 150px; object-fit: contain;"
        class="img-thumbnail"
        @error="handleImageError"
      />
    </div>
  </BForm>
</template>

<script>
import {
  BForm,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BFormCheckbox,
  BInputGroup,
  BInputGroupText
} from 'bootstrap-vue-next'

export default {
  name: 'CourseForm',
  components: {
    BForm,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormCheckbox,
    BInputGroup,
    BInputGroupText
  },
  props: {
    course: { type: Object, required: true }
  },
  emits: ['update-course'],
  methods: {
    updateField(field, value) {
      console.log(`[CourseForm] updateField called -> ${field}:`, value)
      const updatedCourse = { ...this.course, [field]: value }
      this.$emit('update-course', updatedCourse)
      console.log('[CourseForm] emitted updatedCourse:', updatedCourse)
    },
    updateNumber(field, value) {
      const num = value === '' || value === null || value === undefined ? null : Number(value)
      console.log(`[CourseForm] updateNumber called -> ${field}:`, num)
      const updatedCourse = { ...this.course, [field]: num }
      this.$emit('update-course', updatedCourse)
      console.log('[CourseForm] emitted updatedCourse:', updatedCourse)
    },
    updateBoolean(field, value) {
      const boolVal = Boolean(value)
      console.log(`[CourseForm] updateBoolean called -> ${field}:`, boolVal)
      const updatedCourse = { ...this.course, [field]: boolVal }
      this.$emit('update-course', updatedCourse)
      console.log('[CourseForm] emitted updatedCourse:', updatedCourse)
    },
    handleImageError(event) {
      console.warn('[CourseForm] handleImageError: Failed to load image', event.target.src)
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.img-thumbnail {
  border: 2px solid #dee2e6;
  padding: 0.5rem;
  background-color: #f2f2f2;
}
</style>
