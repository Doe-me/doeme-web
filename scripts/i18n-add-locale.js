#!/usr/bin/env node
/**
 * Cria um novo arquivo de tradução em src/locales/<locale>.json a partir do
 * baseline pt-BR.json (locale padrão), preservando todas as chaves existentes
 * com os valores em português como ponto de partida para tradução.
 *
 * Uso: npm run i18n:add -- <locale>
 * Exemplo: npm run i18n:add -- fr-FR
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '..', 'src', 'locales')
const baseLocale = 'pt-BR'

const locale = process.argv[2]

if (!locale) {
  console.error('Uso: npm run i18n:add -- <locale>')
  console.error('Exemplo: npm run i18n:add -- fr-FR')
  process.exit(1)
}

if (!/^[a-z]{2}-[A-Z]{2}$/.test(locale)) {
  console.error(`Locale "${locale}" não parece válido. Use o formato xx-XX (ex: fr-FR).`)
  process.exit(1)
}

const basePath = path.join(localesDir, `${baseLocale}.json`)
const targetPath = path.join(localesDir, `${locale}.json`)

if (!fs.existsSync(basePath)) {
  console.error(`Arquivo base não encontrado: ${basePath}`)
  process.exit(1)
}

if (fs.existsSync(targetPath)) {
  console.error(`O locale "${locale}" já existe em ${targetPath}`)
  process.exit(1)
}

const baseContent = fs.readFileSync(basePath, 'utf-8')
fs.writeFileSync(targetPath, baseContent)

console.log(`Criado src/locales/${locale}.json a partir de ${baseLocale}.json.`)
console.log('Próximos passos:')
console.log(`  1. Traduza os valores em src/locales/${locale}.json`)
console.log(`  2. Importe e registre "${locale}" em src/locales/index.ts (SUPPORTED_LOCALES, LOCALE_LABELS, messages)`)
