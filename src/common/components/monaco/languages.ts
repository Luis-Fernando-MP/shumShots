import astro from '@common/assets/astro'
import shell from '@common/assets/bash'
import bat from '@common/assets/bat'
import c from '@common/assets/c'
import clojure from '@common/assets/clojure'
import coffeescript from '@common/assets/coffeeScript'
import cpp from '@common/assets/cpp'
import csharp from '@common/assets/csharp'
import css from '@common/assets/css'
import dart from '@common/assets/dart'
import dockerfile from '@common/assets/docker'
import go from '@common/assets/go'
import graphql from '@common/assets/graphql'
import handlebars from '@common/assets/handlebars'
import html from '@common/assets/html'
import java from '@common/assets/java'
import javascriptreact from '@common/assets/javascript'
import json from '@common/assets/json'
import kotlin from '@common/assets/kotlin'
import lua from '@common/assets/lua'
import markdown from '@common/assets/markdown'
import sql from '@common/assets/mssql'
// import sql from '@common/assets/mysql'
import php from '@common/assets/php'
import powershell from '@common/assets/powershell'
import prisma from '@common/assets/prisma'
import pug from '@common/assets/pug'
import python from '@common/assets/python'
import ruby from '@common/assets/ruby'
import rust from '@common/assets/rust'
import scss from '@common/assets/sass'
import swift from '@common/assets/swift'
import typescript from '@common/assets/typescript'
import yaml from '@common/assets/yaml'

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
