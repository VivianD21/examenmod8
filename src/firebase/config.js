import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAfQkjP5FypLOx4pHf9WrkV3V_6nGkxG2o",
  authDomain: "examenmodulo7.firebaseapp.com",
  projectId: "examenmodulo7",
  storageBucket: "examenmodulo7.firebasestorage.app",
  messagingSenderId: "925742124353",
  appId: "1:925742124353:web:2432f4d1ca9e36b2b765c0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const auth = getAuth(app)
export const db = getFirestore(app)

// Debug: Verificar que Firebase esté conectado
console.log('Firebase inicializado correctamente')
console.log('Auth:', auth)
console.log('Firestore:', db)

export default app