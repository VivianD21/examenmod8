describe('Login Functionality', () => {
  const testEmail = 'test@example.com'
  const testPassword = 'testpassword123'

  beforeEach(() => {
    // Visitar la página de login antes de cada prueba
    cy.visit('/login')
  })

  it('should display login form', () => {
    // Verificar que los elementos del formulario estén presentes
    cy.get('#email').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
    cy.contains('Iniciar Sesión').should('be.visible')
  })

  it('should show error for invalid credentials', () => {
    // Intentar login con credenciales inválidas
    cy.get('#email').type('invalid@email.com')
    cy.get('#password').type('wrongpassword')
    cy.get('button[type="submit"]').click()

    // Verificar que se muestre un mensaje de error
    cy.get('.alert-danger').should('be.visible')
  })

  it('should show validation errors for empty fields', () => {
    // Intentar enviar formulario vacío
    cy.get('button[type="submit"]').click()

    // Los campos requeridos deberían mostrar validación del navegador
    cy.get('#email:invalid').should('exist')
    cy.get('#password:invalid').should('exist')
  })

  it('should redirect to register page', () => {
    // Hacer clic en el enlace de registro
    cy.contains('Regístrate aquí').click()
    
    // Verificar que se redirija a la página de registro
    cy.url().should('include', '/register')
  })

  // Prueba principal: Login exitoso
  it('should login successfully with valid credentials', () => {
    // Nota: Esta prueba requiere que tengas un usuario de prueba en Firebase
    // o que uses Firebase Emulator Suite para las pruebas
    
    // Interceptar la llamada a Firebase Auth
    cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword*', {
      statusCode: 200,
      body: {
        idToken: 'mock-id-token',
        email: testEmail,
        refreshToken: 'mock-refresh-token',
        expiresIn: '3600',
        localId: 'mock-user-id'
      }
    }).as('loginRequest')

    // Realizar login
    cy.get('#email').type(testEmail)
    cy.get('#password').type(testPassword)
    cy.get('button[type="submit"]').click()

    // Esperar la llamada a la API
    cy.wait('@loginRequest')

    // Verificar que se redirija al home
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // Verificar que el navbar muestre el email del usuario
    cy.get('[data-cy="user-email"]').should('contain', testEmail)
    
    // Verificar que el usuario esté logueado (presencia del botón logout)
    cy.get('[data-cy="logout-btn"]').should('be.visible')
  })

  it('should maintain session after page reload', () => {
    // Simular usuario logueado
    cy.window().then((win) => {
      // Simular que hay un usuario en el localStorage o sessionStorage
      win.localStorage.setItem('firebase:authUser:mock-api-key:[DEFAULT]', JSON.stringify({
        uid: 'mock-user-id',
        email: testEmail,
        emailVerified: true
      }))
    })

    // Recargar la página
    cy.reload()

    // Verificar que el usuario siga logueado
    cy.get('[data-cy="user-email"]', { timeout: 10000 }).should('contain', testEmail)
  })

  it('should logout successfully', () => {
    // Simular usuario logueado
    cy.window().then((win) => {
      win.localStorage.setItem('firebase:authUser:mock-api-key:[DEFAULT]', JSON.stringify({
        uid: 'mock-user-id',
        email: testEmail,
        emailVerified: true
      }))
    })

    cy.visit('/')
    
    // Interceptar la llamada de logout
    cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:signOut*', {
      statusCode: 200,
      body: {}
    }).as('logoutRequest')

    // Hacer logout
    cy.get('[data-cy="logout-btn"]').click()

    // Verificar redirección al login
    cy.url().should('include', '/login')
    
    // Verificar que no hay datos de usuario en localStorage
    cy.window().then((win) => {
      const userData = win.localStorage.getItem('firebase:authUser:mock-api-key:[DEFAULT]')
      expect(userData).to.be.null
    })
  })
})