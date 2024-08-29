import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import react from '@vitejs/plugin-react'
import TranslationsLoader from './rollup/translations-loader-plugin'
import { extractMarketplaceTranslation } from './rollup/modifiers/translations'
import StaticCopy from './rollup/static-copy-plugin'
import { defineConfig, loadEnv } from 'vite'
import { changeLocation, addParameters } from './rollup/modifiers/manifest'
import process from 'node:process'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Function to handle additional translation transformations
function additionalTranslationTransform(content, filename) {
  if (path.basename(filename) === 'en.json') {
    const parsedContent = JSON.parse(content)
    const sourceDir = resolve(__dirname, 'src/translations')
    
    fs.readdirSync(sourceDir).forEach(file => {
      if (file.startsWith('en.') && file.endsWith('.md')) {
        const [, ...keys] = file.slice(0, -3).split('.')
        const mdContent = fs.readFileSync(resolve(sourceDir, file), 'utf-8')
        let current = parsedContent
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {}
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = mdContent.trim()
      }
    })

    return JSON.stringify(parsedContent, null, 2)
  }
  return content
}

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    base: './',
    plugins: [
      react(),
      TranslationsLoader(),
      StaticCopy({
        targets: [
          { src: resolve(__dirname, 'src/assets/*'), dest: './' },
          {
            src: resolve(__dirname, 'src/manifest.json'),
            dest: '../',
            modifier: (content, filename) => addParameters(changeLocation(content, filename))
          },
          {
            src: resolve(__dirname, 'src/translations/en.json'),
            dest: '../translations',
            modifier: (content, filename) => {
              const extractedContent = extractMarketplaceTranslation(content, filename)
              return additionalTranslationTransform(extractedContent, filename)
            }
          }
        ]
      })
    ],
    root: 'src',
    test: {
      include: ['../{test,spec}/**/*.{test,spec}.{js,ts,jsx}'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      globals: true,
      environment: 'jsdom'
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html')
        },
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`
        },
        watch: {
          include: 'src/**'
        }
      },
      outDir: resolve(__dirname, 'dist/assets'),
      emptyOutDir: true
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    }
  })
}