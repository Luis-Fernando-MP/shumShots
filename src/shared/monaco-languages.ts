import astro from './assets/astro'
import shell from './assets/bash'
import bat from './assets/bat'
import c from './assets/c'
import clojure from './assets/clojure'
import coffeescript from './assets/coffeeScript'
import cpp from './assets/cpp'
import csharp from './assets/csharp'
import css from './assets/css'
import dart from './assets/dart'
import dockerfile from './assets/docker'
import go from './assets/go'
import graphql from './assets/graphql'
import handlebars from './assets/handlebars'
import html from './assets/html'
import java from './assets/java'
import javascriptreact from './assets/javascript'
import json from './assets/json'
import kotlin from './assets/kotlin'
import lua from './assets/lua'
import markdown from './assets/markdown'
import sql from './assets/mssql'
// import sql from './assets/mysql'
import php from './assets/php'
import powershell from './assets/powershell'
import prisma from './assets/prisma'
import pug from './assets/pug'
import python from './assets/python'
import ruby from './assets/ruby'
import rust from './assets/rust'
import scss from './assets/sass'
import swift from './assets/swift'
import typescript from './assets/typescript'
import yaml from './assets/yaml'

export type MonacoLanguage = { Icon: React.ElementType; language: string; short: string }

const monacoLanguagesIcons = {
  'Frontend Web': {
    html: {
      Icon: html,
      language: 'html',
      short: 'html'
    },
    css: {
      Icon: css,
      language: 'css',
      short: 'css'
    },
    javascript: {
      Icon: javascriptreact,
      language: 'javascript',
      short: 'js'
    },
    typescript: {
      Icon: typescript,
      language: 'typescript',
      short: 'ts'
    },
    astro: {
      Icon: astro,
      language: 'astro',
      short: 'astro'
    },
    pug: {
      Icon: pug,
      language: 'pug',
      short: 'pug'
    },
    handlebars: {
      Icon: handlebars,
      language: 'handlebars',
      short: 'handlebars'
    },
    sass: {
      Icon: scss,
      language: 'scss',
      short: 'scss'
    },
    markdown: {
      Icon: markdown,
      language: 'markdown',
      short: 'md'
    }
  },

  'Backend/Servidores': {
    php: {
      Icon: php,
      language: 'php',
      short: 'php'
    },
    python: {
      Icon: python,
      language: 'python',
      short: 'py'
    },
    ruby: {
      Icon: ruby,
      language: 'ruby',
      short: 'rb'
    },
    go: {
      Icon: go,
      language: 'go',
      short: 'go'
    },
    java: {
      Icon: java,
      language: 'java',
      short: 'java'
    },
    c: {
      Icon: c,
      language: 'c',
      short: 'c'
    },
    'c#': {
      Icon: csharp,
      language: 'csharp',
      short: 'c#'
    },
    'c++': {
      Icon: cpp,
      language: 'cpp',
      short: 'c++'
    },
    kotlin: {
      Icon: kotlin,
      language: 'kotlin',
      short: 'kt'
    },
    rust: {
      Icon: rust,
      language: 'rust',
      short: 'rs'
    }
  },

  'Base de Datos y Consulta': {
    sql: {
      Icon: sql,
      language: 'sql',
      short: 'sql'
    },
    graphql: {
      Icon: graphql,
      language: 'graphql',
      short: 'gql'
    },
    prisma: {
      Icon: prisma,
      language: 'graphql',
      short: 'prisma'
    }
  },

  'Scripting y Automatización': {
    bash: {
      Icon: shell,
      language: 'shell',
      short: 'bash'
    },
    powershell: {
      Icon: powershell,
      language: 'powershell',
      short: 'ps'
    },
    bat: {
      Icon: bat,
      language: 'bat',
      short: 'bat'
    }
  },

  'Contenedores y DevOps': {
    dockerfile: {
      Icon: dockerfile,
      language: 'dockerfile',
      short: 'dockerfile'
    }
  },

  'Lenguajes Funcionales': {
    clojure: {
      Icon: clojure,
      language: 'clojure',
      short: 'clojure'
    }
  },

  'Lenguajes de Markup': {
    yaml: {
      Icon: yaml,
      language: 'yaml',
      short: 'yaml'
    },
    json: {
      Icon: json,
      language: 'json',
      short: 'json'
    }
  },

  'Desarrollo Móvil': {
    dart: {
      Icon: dart,
      language: 'dart',
      short: 'dart'
    },
    swift: {
      Icon: swift,
      language: 'swift',
      short: 'swift'
    }
  },

  'Otros Lenguajes': {
    coffeescript: {
      Icon: coffeescript,
      language: 'coffeescript',
      short: 'coffeescript'
    },
    lua: {
      Icon: lua,
      language: 'lua',
      short: 'lua'
    },
    shell: {
      Icon: shell,
      language: 'shell',
      short: 'bash'
    }
  }
}

export default monacoLanguagesIcons
