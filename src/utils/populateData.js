import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// Datos iniciales de cursos
const initialCourses = [
  {
    "codigo": "0001",
    "nombre": "HTML",
    "estado": true,
    "precio": 30000,
    "duracion": "1 mes",
    "descripcion": "curso html",
    "cupos": 10,
    "inscritos": 0,
    "img": "https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png"
  },
  {
    "codigo": "0002",
    "nombre": "CSS",
    "estado": false,
    "precio": 20000,
    "duracion": "1 mes",
    "descripcion": "curso css",
    "cupos": 20,
    "inscritos": 0,
    "img": "https://cdn.pixabay.com/photo/2016/11/19/23/00/css3-1841590_1280.png"
  },
  {
    "codigo": "0003",
    "nombre": "SASS",
    "estado": true,
    "precio": 40000,
    "duracion": "2 mes",
    "descripcion": "curso sass",
    "cupos": 30,
    "inscritos": 0,
    "img": "https://miro.medium.com/max/512/1*9U1toerFxB8aiFRreLxEUQ.png"
  },
  {
    "codigo": "0004",
    "nombre": "VUE",
    "estado": false,
    "precio": 50000,
    "duracion": "3 mes",
    "descripcion": "curso vue",
    "cupos": 15,
    "inscritos": 0,
    "img": "https://thumbs.gfycat.com/PinkPiercingBullsize_restricted.gif"
  }
]

export const populateInitialData = async () => {
  try {
    console.log('Agregando cursos iniciales...')
    
    const coursesCollection = collection(db, 'courses')
    
    for (const course of initialCourses) {
      const docRef = await addDoc(coursesCollection, course)
      console.log(`Curso ${course.nombre} agregado con ID: ${docRef.id}`)
    }
    
    console.log('Todos los cursos iniciales han sido agregados exitosamente!')
    return { success: true }
    
  } catch (error) {
    console.error('Error al agregar cursos iniciales:', error)
    return { success: false, error: error.message }
  }
}

// Si se ejecuta directamente este archivo
if (import.meta.url === `file://${process.argv[1]}`) {
  populateInitialData()
}