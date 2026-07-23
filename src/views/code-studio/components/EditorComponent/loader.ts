import { loader } from '@monaco-editor/react'

// you can change the source of the monaco files
loader.config({ paths: { vs: './monaco' } })

// you can configure the locales
loader.config({ 'vs/nls': { availableLanguages: { '*': 'de' } } })

// or
loader.config({
  paths: {
    vs: './monaco'
  },
  'vs/nls': {
    availableLanguages: {
      '*': 'de'
    }
  }
})
