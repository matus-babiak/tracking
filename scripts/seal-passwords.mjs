/**
 * Prečíta passwords.local.json (plaintext), zahashuje heslá a zapíše
 * public/passwords.sealed.json (AES-256-GCM).
 *
 * Použitie: npm run seal-passwords
 * Vyžaduje .env.local s VITE_AUTH_KEY
 */
import { createCipheriv, createHash, randomBytes } from 'crypto'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const localPath = join(root, 'passwords.local.json')
const envPath = join(root, '.env.local')
const outPath = join(root, 'public', 'passwords.sealed.json')

function loadAuthKey() {
  if (existsSync(envPath)) {
    const line = readFileSync(envPath, 'utf8')
      .split('\n')
      .find((l) => l.startsWith('VITE_AUTH_KEY='))
    if (line) {
      const val = line.slice('VITE_AUTH_KEY='.length).trim().replace(/^["']|["']$/g, '')
      if (val && val !== 'change-me-to-a-long-random-secret') return val
    }
  }
  console.error('Chýba VITE_AUTH_KEY v .env.local (skopíruj z .env.example a zmeň hodnotu).')
  process.exit(1)
}

function deriveKey(secret) {
  return createHash('sha256').update(secret).digest()
}

function seal() {
  if (!existsSync(localPath)) {
    console.error('Chýba passwords.local.json — vytvor súbor s heslami pre klientov.')
    process.exit(1)
  }

  const authKey = loadAuthKey()
  const key = deriveKey(authKey)
  const salt = 'tracking-client-auth-v1'
  const local = JSON.parse(readFileSync(localPath, 'utf8'))

  const hashed = {}
  for (const [clientId, password] of Object.entries(local)) {
    if (!password) continue
    hashed[clientId] = createHash('sha256').update(`${salt}:${password}`).digest('hex')
  }

  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const enc = Buffer.concat([cipher.update(JSON.stringify({ salt, hashes: hashed }), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  const payload = {
    v: 1,
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: enc.toString('base64'),
  }

  mkdirSync(join(root, 'public'), { recursive: true })
  writeFileSync(outPath, JSON.stringify(payload))
  console.log(`Zapísané ${outPath} (${Object.keys(hashed).length} záznamov)`)
}

seal()
