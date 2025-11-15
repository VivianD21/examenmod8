import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_EMAIL = process.env.TEST_USER_EMAIL || 'tester.examenmod7@example.com'
const DEFAULT_PASSWORD = process.env.TEST_USER_PASSWORD || 'Vue1234!'

const email = process.argv[2] || DEFAULT_EMAIL
const password = process.argv[3] || DEFAULT_PASSWORD

async function extractApiKey() {
  const configPath = path.resolve('src/firebase/config.js')
  const txt = await fs.readFile(configPath, 'utf8')
  const m = txt.match(/apiKey:\s*["']([^"']+)["']/)
  if (!m) throw new Error('No se pudo extraer apiKey desde src/firebase/config.js')
  return m[1]
}

async function createUser(apiKey) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
  const body = { email, password, returnSecureToken: true }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  if (!res.ok) {
    // If email exists, treat as success
    const code = data?.error?.message
    if (code === 'EMAIL_EXISTS') {
      return { created: false, reason: 'EMAIL_EXISTS' }
    }
    throw new Error(`Error crear usuario: ${code || res.status}`)
  }
  return { created: true, data }
}

async function updateTxtFile() {
  const txtPath = path.resolve('mifirebaseapp.txt')
  let content = ''
  try {
    content = await fs.readFile(txtPath, 'utf8')
  } catch {
    // create scaffold if not exists
    content = `Firebase Hosting - Información de Acceso\n\nURL de la aplicación (Firebase Hosting):\n<PEGAR_AQUI_LA_URL_DESPUES_DEL_DEPLOY>\n\nUsuario de prueba (email):\n<completar>\n\nClave de prueba (password):\n<completar>\n`
  }
  content = content
    .replace(/Usuario de prueba \(email\):\n.*?/s, `Usuario de prueba (email):\n${email}`)
    .replace(/Clave de prueba \(password\):\n.*?/s, `Clave de prueba (password):\n${password}`)
  await fs.writeFile(txtPath, content, 'utf8')
}

async function main() {
  try {
    const apiKey = await extractApiKey()
    const result = await createUser(apiKey)
    await updateTxtFile()
    console.log(JSON.stringify({ ok: true, created: result.created, email }, null, 2))
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
