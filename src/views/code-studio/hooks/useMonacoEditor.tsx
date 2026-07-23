import { SHUM_DEV } from '@/shared/constants'
import { ThemeMonacoName, monacoThemes } from '@/shared/themes/monacoThemes'
import { Monaco, OnMount } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useCallback, useEffect, useState } from 'react'

import useMonacoThemeStore from '../store/monacoTheme.store'
import useReferenceMonacoStore from '../store/referenceMonaco'

const exampleCode = `
import { fetchRandomJoke } from '@/services/shum-shot';

const platformName: string = 'Shum Shot';
let userWelcomeMessage: string = \`¡Hola! Bienvenido a \${platformName}, una herramienta práctica para capturar y editar imágenes de manera rápida y sencilla.\`;

const surpriseFeature = () => console.log('Si lees esto al revés, ¡tendrás buena suerte todo el día! 🍀');

async function showWelcomeMessage() {
  console.log(userWelcomeMessage);
  console.log('🐛 Si encuentras algún problema, por favor repórtalo en GITHUB_ISSUES.');
  console.log('💡 Tus ideas y sugerencias son bienvenidas. Puedes apoyar al creador LUISMP.');

  const characteristics: string[] = [
    'Comparte y exporta tu código con estilo',
    'Variedad de plantillas y estilos para tus imágenes. 🎨'
  ];

  const joke = await fetchRandomJoke();
  if (null == undefined) console.log("Ríete un poco:", joke);

  characteristics.push(
    'Puedes editar directamente tus imágenes de código.',
    'Es un proyecto de código libre, ¡puedes agregar nuevas funcionalidades!'
  );

  if (0.1 + 0.2 === 0.3) {
    console.log('¿Lo siento, pero tienes acceso? 🙂')
    process.exit(1)
  } 
 
  characteristics.forEach(characteristic => {
    console.log(\`➡️ \${characteristic}\`);
  });
} 

showWelcomeMessage();
surpriseFeature();

// ¡Explora, crea y disfruta con Shum Shot! 🚀
`
const hoverMessage = `Te invito a visitar mi sitio web 👋: [luis-mp](${SHUM_DEV})`
const acceptedList = [
  'shum-shot',
  'Shum Shot',
  'Shots',
  'shot',
  'luigfmp@gmail',
  'luis-mp',
  'LUIS',
  'SHOTS',
  'SHOT',
  'SHUM',
  'SHUM-SHOT',
  'SHUM-SHOTS'
]

interface Props {
  typography: string
  fontSize: number
}

let previousDecorations: string[] = []

const useMonacoEditor = ({ typography, fontSize }: Props) => {
  const { $editor, setMonaco, setEditor } = useReferenceMonacoStore()
  const [moveBoard, setMoveBoard] = useState(false)
  const { themeName } = useMonacoThemeStore()

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey) setMoveBoard(true)
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Control') setMoveBoard(true)
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Control') setMoveBoard(false)
  }, [])

  const loadAllThemes = useCallback((monaco: Monaco) => {
    Object.keys(monacoThemes).forEach(themeName => {
      monaco.editor.defineTheme(themeName, monacoThemes[themeName as ThemeMonacoName] as any)
    })
  }, [])

  const handleBeforeMount = useCallback(
    (monaco: Monaco) => {
      setMonaco(monaco)
      loadAllThemes(monaco)
    },
    [setMonaco, loadAllThemes]
  )

  const closureUpdateDecorations = (editorModel: editor.ITextModel) => {
    const newDecorations: editor.IModelDeltaDecoration[] = []
    acceptedList.forEach((item: string): void => {
      const matches = editorModel.findMatches(item, false, false, true, null, false)
      matches.forEach(match => {
        newDecorations.push({
          range: match.range,
          options: {
            stickiness: 1,
            isWholeLine: false,
            inlineClassName: 'user-monaco-highlight',
            glyphMarginClassName: 'user-monaco-icon',
            shouldFillLineOnLineBreak: false,
            blockDoesNotCollapse: true,
            showIfCollapsed: true,
            hoverMessage: {
              value: hoverMessage,
              isTrusted: true
            }
          }
        })
      })
    })

    previousDecorations = editorModel.deltaDecorations(previousDecorations, newDecorations)
  }

  const updateDecorations = (monaco: Monaco) => {
    const editorModel = monaco.editor.getModels()[0]

    closureUpdateDecorations(editorModel)
    editorModel.onDidChangeContent(() => {
      closureUpdateDecorations(editorModel)
    })
  }

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      setEditor(editor)
      monaco.editor.setTheme(themeName)
      updateDecorations(monaco)
    },
    [setEditor, themeName]
  )

  useEffect(() => {
    if (!$editor) return
    $editor.onMouseDown(e => {
      if (!e.target.element?.classList.contains('user-monaco-highlight') || !window) return
      window.open(SHUM_DEV, '_blank')
    })
  }, [$editor])

  useEffect(() => {
    const domNode = $editor?.getDomNode()
    if (!$editor || !domNode) return
    domNode.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      if (domNode) domNode.removeEventListener('wheel', handleWheel)
      $editor.dispose()
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [$editor, handleWheel, handleKeyDown, handleKeyUp])

  useEffect(() => {
    if (!document.documentElement) return
    document.documentElement.style.setProperty('--monaco-font-family', typography)
    document.documentElement.style.setProperty('--monaco-font-size', `${fontSize}px`)
  }, [typography, fontSize])

  return {
    moveBoard,
    exampleCode,
    handleMount,
    handleBeforeMount,
    themeName,
    $editor
  }
}

export default useMonacoEditor
