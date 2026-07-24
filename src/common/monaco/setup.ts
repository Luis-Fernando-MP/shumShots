'use client'

import { loader } from '@monaco-editor/react'

const MONACO_VS = '/monaco/min/vs'

const createWorkerUrl = () => {
  if (typeof window === 'undefined') return ''

  const baseUrl = `${window.location.origin}/monaco/min/`
  return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
    self.MonacoEnvironment = { baseUrl: ${JSON.stringify(baseUrl)} };
    importScripts(${JSON.stringify(`${window.location.origin}${MONACO_VS}/base/worker/workerMain.js`)});
  `)}`
}

if (typeof window !== 'undefined') {
  window.MonacoEnvironment = {
    getWorkerUrl: createWorkerUrl
  }
}

loader.config({
  paths: {
    vs: MONACO_VS
  }
})
