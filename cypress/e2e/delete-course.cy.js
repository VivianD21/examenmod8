describe('Delete Course Functionality', () => {
  const testEmail = 'admin@example.com'
  const mockCourse = {
    id: 'mock-course-id',
    codigo: '0001',
    nombre: 'HTML Test Course',
    descripcion: 'Test course description',
    precio: 30000,
    duracion: '1 mes',
    cupos: 10,
    inscritos: 0,
    estado: true,
    img: 'https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png'
  }

  beforeEach(() => {
    // Simular usuario autenticado
    cy.window().then((win) => {
      win.localStorage.setItem('firebase:authUser:mock-api-key:[DEFAULT]', JSON.stringify({
        uid: 'mock-user-id',
        email: testEmail,
        emailVerified: true
      }))
    })

    // Interceptar llamadas a Firebase
    cy.intercept('GET', '**/firestore.googleapis.com/**', {
      statusCode: 200,
      body: {
        documents: [
          {
            name: `courses/${mockCourse.id}`,
            fields: {
              codigo: { stringValue: mockCourse.codigo },
              nombre: { stringValue: mockCourse.nombre },
              descripcion: { stringValue: mockCourse.descripcion },
              precio: { integerValue: mockCourse.precio },
              duracion: { stringValue: mockCourse.duracion },
              cupos: { integerValue: mockCourse.cupos },
              inscritos: { integerValue: mockCourse.inscritos },
              estado: { booleanValue: mockCourse.estado },
              img: { stringValue: mockCourse.img }
            }
          }
        ]
      }
    }).as('getCourses')

    // Visitar la página de administración
    cy.visit('/admin')
    cy.wait('@getCourses')
  })

  it('should display courses in admin table', () => {
    // Verificar que la tabla de cursos se muestre
    cy.get('table').should('be.visible')
    cy.contains(mockCourse.nombre).should('be.visible')
    cy.contains(mockCourse.codigo).should('be.visible')
  })

  it('should show delete confirmation modal', () => {
    // Hacer clic en el botón de eliminar
    cy.get('[data-cy="delete-course-btn"]').first().click()

    // Verificar que se muestre el modal de confirmación
    cy.get('[data-cy="confirm-delete-modal"]').should('be.visible')
    cy.contains('¿Realmente deseas eliminar').should('be.visible')
    cy.contains(mockCourse.nombre).should('be.visible')
    
    // Verificar que los botones estén presentes
    cy.get('[data-cy="cancel-delete-btn"]').should('be.visible')
    cy.get('[data-cy="confirm-delete-btn"]').should('be.visible')
  })

  it('should cancel delete operation', () => {
    // Abrir modal de confirmación
    cy.get('[data-cy="delete-course-btn"]').first().click()
    cy.get('[data-cy="confirm-delete-modal"]').should('be.visible')

    // Cancelar la eliminación
    cy.get('[data-cy="cancel-delete-btn"]').click()

    // Verificar que el modal se cierre
    cy.get('[data-cy="confirm-delete-modal"]').should('not.exist')
    
    // Verificar que el curso siga en la tabla
    cy.contains(mockCourse.nombre).should('be.visible')
  })

  it('should delete course successfully', () => {
    // Interceptar la llamada de eliminación
    cy.intercept('DELETE', `**/firestore.googleapis.com/**/courses/${mockCourse.id}`, {
      statusCode: 200,
      body: {}
    }).as('deleteCourse')

    // Interceptar la llamada para obtener cursos actualizados (sin el curso eliminado)
    cy.intercept('GET', '**/firestore.googleapis.com/**', {
      statusCode: 200,
      body: {
        documents: [] // Lista vacía después de eliminar
      }
    }).as('getCoursesAfterDelete')

    // Abrir modal de confirmación
    cy.get('[data-cy="delete-course-btn"]').first().click()
    cy.get('[data-cy="confirm-delete-modal"]').should('be.visible')

    // Confirmar la eliminación
    cy.get('[data-cy="confirm-delete-btn"]').click()

    // Esperar la llamada de eliminación
    cy.wait('@deleteCourse')

    // Verificar que el modal se cierre
    cy.get('[data-cy="confirm-delete-modal"]').should('not.exist')

    // Verificar que el curso ya no esté en la tabla
    cy.contains(mockCourse.nombre).should('not.exist')
  })

  it('should handle delete error gracefully', () => {
    // Interceptar la llamada de eliminación con error
    cy.intercept('DELETE', `**/firestore.googleapis.com/**/courses/${mockCourse.id}`, {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('deleteCourseFail')

    // Abrir modal de confirmación
    cy.get('[data-cy="delete-course-btn"]').first().click()
    cy.get('[data-cy="confirm-delete-modal"]').should('be.visible')

    // Confirmar la eliminación
    cy.get('[data-cy="confirm-delete-btn"]').click()

    // Esperar la llamada fallida
    cy.wait('@deleteCourseFail')

    // Verificar que se muestre un mensaje de error
    cy.get('.alert-danger').should('be.visible')
    cy.contains('Error').should('be.visible')
  })

  it('should disable delete button while loading', () => {
    // Interceptar con delay para simular carga
    cy.intercept('DELETE', `**/firestore.googleapis.com/**/courses/${mockCourse.id}`, (req) => {
      req.reply((res) => {
        // Delay de 2 segundos
        return new Promise((resolve) => {
          setTimeout(() => resolve(res.send({ statusCode: 200 })), 2000)
        })
      })
    }).as('deleteCourseSlow')

    // Abrir modal y confirmar eliminación
    cy.get('[data-cy="delete-course-btn"]').first().click()
    cy.get('[data-cy="confirm-delete-btn"]').click()

    // Verificar que el botón se deshabilite durante la carga
    cy.get('[data-cy="confirm-delete-btn"]').should('be.disabled')
    cy.get('.spinner-border').should('be.visible')
  })

  it('should update UI immediately after successful delete', () => {
    // Simular múltiples cursos
    const multipleCourses = [
      mockCourse,
      {
        ...mockCourse,
        id: 'mock-course-id-2',
        codigo: '0002',
        nombre: 'CSS Test Course'
      }
    ]

    cy.intercept('GET', '**/firestore.googleapis.com/**', {
      statusCode: 200,
      body: {
        documents: multipleCourses.map(course => ({
          name: `courses/${course.id}`,
          fields: {
            codigo: { stringValue: course.codigo },
            nombre: { stringValue: course.nombre },
            descripcion: { stringValue: course.descripcion },
            precio: { integerValue: course.precio },
            duracion: { stringValue: course.duracion },
            cupos: { integerValue: course.cupos },
            inscritos: { integerValue: course.inscritos },
            estado: { booleanValue: course.estado },
            img: { stringValue: course.img }
          }
        }))
      }
    })

    cy.visit('/admin')

    // Verificar que ambos cursos estén presentes
    cy.contains('HTML Test Course').should('be.visible')
    cy.contains('CSS Test Course').should('be.visible')

    // Interceptar eliminación exitosa
    cy.intercept('DELETE', `**/firestore.googleapis.com/**/courses/${mockCourse.id}`, {
      statusCode: 200
    }).as('deleteCourse')

    // Interceptar actualización de lista sin el curso eliminado
    cy.intercept('GET', '**/firestore.googleapis.com/**', {
      statusCode: 200,
      body: {
        documents: [{
          name: `courses/mock-course-id-2`,
          fields: {
            codigo: { stringValue: '0002' },
            nombre: { stringValue: 'CSS Test Course' },
            descripcion: { stringValue: 'Test course description' },
            precio: { integerValue: 20000 },
            duracion: { stringValue: '1 mes' },
            cupos: { integerValue: 20 },
            inscritos: { integerValue: 0 },
            estado: { booleanValue: true },
            img: { stringValue: 'https://example.com/css.png' }
          }
        }]
      }
    }).as('getUpdatedCourses')

    // Eliminar el primer curso
    cy.get('[data-cy="delete-course-btn"]').first().click()
    cy.get('[data-cy="confirm-delete-btn"]').click()

    cy.wait('@deleteCourse')
    
    // Verificar actualización de UI
    cy.contains('HTML Test Course').should('not.exist')
    cy.contains('CSS Test Course').should('be.visible')
  })
})