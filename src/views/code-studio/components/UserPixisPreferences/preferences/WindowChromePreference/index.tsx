'use client'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore from '@views/code-studio/store/workspace.store'
import {
  BREADCRUMB_SEPARATORS,
  CHROME_LOOK_PRESETS,
  HEADER_DENSITY_PX,
  MAC_TRAFFIC_PRESETS,
  chromeDefaults,
  matchesChromePreset
} from '../../utils/pixis.config'
import type {
  BreadcrumbSeparator,
  ChromeSide,
  HeaderDensity,
  MacTrafficPreset,
  PixisChromeState,
  WindowControlsStyle
} from '@views/code-studio/utils/preferences'
import { ACTIVITY_ICON_META, type ActivityIconId } from '@views/code-studio/utils/workspace.types'
import { ArrowDown, ArrowUp, Blocks, Files, GitBranch, Search, Settings } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

import {
  PreferenceField,
  PreferenceToggle,
  usePreferenceSearch
} from '@views/code-studio/components/preferences/PreferenceField'

const CONTROLS_LABEL: Record<WindowControlsStyle, string> = {
  mac: 'Mac',
  windows: 'Windows',
  none: 'Ninguno'
}

const SIDE_LABEL: Record<ChromeSide, string> = {
  left: 'Izquierda',
  right: 'Derecha'
}

const DENSITY_LABEL: Record<HeaderDensity, string> = {
  compact: 'Compacto',
  comfortable: 'Normal',
  tall: 'Alto'
}

const TINT_LABEL = {
  none: 'Ninguno',
  subtle: 'Suave',
  solid: 'Sólido'
} as const

const TAB_STYLE_LABEL = {
  soft: 'Soft',
  underline: 'Underline',
  browser: 'Browser'
} as const

const SEPARATOR_LABEL: Record<BreadcrumbSeparator, string> = {
  '/': 'Slash',
  '>': 'Mayor',
  '›': 'Chevron',
  '·': 'Punto'
}

const STATUS_DENSITY = [
  { id: 'compact' as const, label: 'Compacta', compact: true },
  { id: 'full' as const, label: 'Full', compact: false }
]

const PreviewCard: FC<{
  label: string
  selected: boolean
  onSelect: () => void
  children: ReactNode
  className?: string
}> = ({ label, selected, onSelect, children, className }) => {
  return (
    <Button
      type='button'
      size='sm'
      variant='soft'
      isSelected={selected}
      aria-pressed={selected}
      aria-label={label}
      onClick={onSelect}
      className={cn('h-auto w-full flex-col gap-2 rounded-[12px] px-2 py-2.5', className)}
    >
      <span className='bg-muted/40 flex h-14 w-full items-center justify-center overflow-hidden rounded-[8px]'>
        {children}
      </span>
      <Text.emphasis className='leading-none'>{label}</Text.emphasis>
    </Button>
  )
}

const TrafficLights: FC<{ macColors: MacTrafficPreset }> = ({ macColors }) => {
  const colors = MAC_TRAFFIC_PRESETS[macColors]
  return (
    <span className='flex gap-[2px]'>
      <span className='size-[5px] rounded-full' style={{ background: colors.close }} />
      <span className='size-[5px] rounded-full' style={{ background: colors.minimize }} />
      <span className='size-[5px] rounded-full' style={{ background: colors.maximize }} />
    </span>
  )
}

const WindowsGlyphs = () => <span className='text-[6px] leading-none opacity-50'>─ □ ×</span>

const SideControls: FC<{
  controls: WindowControlsStyle
  side: ChromeSide
  position: ChromeSide
  macColors: MacTrafficPreset
}> = ({ controls, side, position, macColors }) => {
  if (controls === 'none') return null
  if (side !== position) return null
  if (controls === 'mac') return <TrafficLights macColors={macColors} />
  return <WindowsGlyphs />
}

const MiniWindow: FC<{
  controls?: WindowControlsStyle
  side?: ChromeSide
  macColors?: MacTrafficPreset
  density?: HeaderDensity
  activityBar?: boolean
  fileExplorer?: boolean
  statusBar?: boolean
  breadcrumb?: boolean
  size?: 'sm' | 'lg'
}> = ({
  controls = 'mac',
  side = 'left',
  macColors = 'classic',
  density = 'comfortable',
  activityBar = false,
  fileExplorer = false,
  statusBar = false,
  breadcrumb = false,
  size = 'sm'
}) => {
  const headerH = Math.max(10, Math.round(HEADER_DENSITY_PX[density] * (size === 'lg' ? 0.42 : 0.32)))

  return (
    <div
      className={cn(
        'bg-background/80 flex flex-col overflow-hidden rounded-[4px] border border-current/15',
        size === 'lg' ? 'h-[5.5rem] w-full' : 'h-[3rem] w-[92%]'
      )}
    >
      <div className='flex items-center gap-0.5 px-1' style={{ height: headerH }}>
        <SideControls controls={controls} side={side} position='left' macColors={macColors} />
        <span className='flex min-w-0 flex-1 justify-center'>
          <span className='flex gap-[2px]'>
            <span className='h-[6px] w-5 rounded-[1px] bg-current/20' />
            <span className='h-[6px] w-3.5 rounded-[1px] bg-current/10' />
          </span>
        </span>
        <SideControls controls={controls} side={side} position='right' macColors={macColors} />
      </div>
      <div className='flex min-h-0 flex-1'>
        {activityBar && <span className='w-[5px] shrink-0 bg-current/10' />}
        {fileExplorer && <span className='w-3 shrink-0 bg-current/6' />}
        <div className='flex min-w-0 flex-1 flex-col'>
          {breadcrumb && <span className='mx-1 mt-[2px] h-[2px] w-3/4 rounded-full bg-current/10' />}
          <span className='m-1 min-h-0 flex-1 rounded-[1px] bg-current/8' />
          {statusBar && <span className='h-[3px] w-full bg-current/15' />}
        </div>
      </div>
    </div>
  )
}

const BreadcrumbPreview: FC<{ separator: BreadcrumbSeparator }> = ({ separator }) => {
  const parts = ['src', 'views', 'pixis.ts']
  return (
    <div className='flex w-[90%] items-center justify-center gap-1 px-1 text-[8px] leading-none opacity-80'>
      {parts.map((part, i) => (
        <span key={part} className='flex items-center gap-1'>
          {i > 0 && <span className='opacity-45'>{separator}</span>}
          <span className={cn(i === parts.length - 1 && 'font-medium')}>{part}</span>
        </span>
      ))}
    </div>
  )
}

const StatusBarPreview: FC<{ compact?: boolean }> = ({ compact }) => (
  <div className='bg-current/10 flex h-5 w-[92%] items-center justify-between rounded-sm px-1.5 text-[7px] leading-none'>
    <span className='truncate opacity-80'>
      pixis.ts
      {!compact && ' · ts'}
    </span>
    <span className='shrink-0 opacity-80'>
      Ln 12
      {!compact && ' · 42 lines'}
    </span>
  </div>
)

const ActivityPreview: FC = () => (
  <div className='flex h-12 items-center gap-1 rounded-sm border border-current/10 px-1.5'>
    {[Files, Search, GitBranch, Blocks, Settings].map((Icon, i) => (
      <span
        key={Icon.displayName ?? i}
        className={cn(
          'inline-flex size-5 items-center justify-center rounded-sm',
          i === 0 && 'bg-current/15',
          i !== 0 && 'opacity-40'
        )}
      >
        <Icon className='size-3' strokeWidth={1.75} />
      </span>
    ))}
  </div>
)

const Row: FC<{ title: string; description: string; keywords?: string; children: ReactNode }> = ({
  title,
  description,
  keywords,
  children
}) => (
  <PreferenceField title={title} subtitle={description} keywords={keywords}>
    {children}
  </PreferenceField>
)

const WindowChromePreference: FC = () => {
  const chromeState = usePixisPreferencesStore(s => s.pixis.chrome)
  const chrome = { ...chromeDefaults, ...chromeState }
  const patchChrome = usePixisPreferencesStore(s => s.patchChrome)
  const activityOrder = useWorkspaceStore(s => s.activityOrder)
  const moveActivityIcon = useWorkspaceStore(s => s.moveActivityIcon)
  const query = usePreferenceSearch()
  const searching = query.trim().length > 0

  const set = <K extends keyof PixisChromeState>(key: K, value: PixisChromeState[K]) => {
    patchChrome({ [key]: value })
  }

  return (
    <>
      <div className='flex flex-col gap-6'>
        <div className='border-border/60 bg-muted/20 flex w-full items-center justify-center rounded-[12px] border p-3'>
          <MiniWindow
            size='lg'
            controls={chrome.controls}
            side={chrome.controlsSide}
            macColors={chrome.macColors}
            density={chrome.headerDensity}
            activityBar={chrome.activityBar}
            fileExplorer={chrome.fileExplorer}
            statusBar={chrome.statusBar}
            breadcrumb={chrome.breadcrumb}
          />
        </div>

        <Row
          title='Estilos'
          description='Atajos que aplican varios estilos. El activo queda marcado.'
          keywords='preset presets look macos vscode windows'
        >
          <div className='grid w-full grid-cols-2 gap-2'>
            {CHROME_LOOK_PRESETS.map(preset => (
              <PreviewCard
                key={preset.id}
                label={preset.label}
                selected={matchesChromePreset(chrome, preset.patch)}
                onSelect={() => patchChrome(preset.patch)}
              >
                <MiniWindow
                  controls={preset.patch.controls}
                  side={preset.patch.controlsSide}
                  activityBar={preset.patch.activityBar}
                  fileExplorer={preset.patch.fileExplorer}
                  statusBar={preset.patch.statusBar}
                  breadcrumb={preset.patch.breadcrumb}
                />
              </PreviewCard>
            ))}
          </div>
        </Row>

        <Row
          title='Controles de ventana'
          description='Bolitas Mac, iconos Windows o sin controles.'
          keywords='controls mac windows traffic lights'
        >
          <div className='grid w-full grid-cols-2 gap-2'>
            {(['mac', 'windows', 'none'] as const).map(style => (
              <PreviewCard
                key={style}
                label={CONTROLS_LABEL[style]}
                selected={chrome.controls === style}
                onSelect={() => set('controls', style)}
              >
                <MiniWindow controls={style} side={chrome.controlsSide} macColors={chrome.macColors} />
              </PreviewCard>
            ))}
          </div>
        </Row>

        {(chrome.controls !== 'none' || searching) && (
          <Row title='Lado de controles' description='Izquierda (Mac) o derecha (Windows).' keywords='side left right'>
            <PreferenceToggle
              value={chrome.controlsSide}
              options={['left', 'right'] as const}
              onChange={v => set('controlsSide', v)}
              label={v => SIDE_LABEL[v]}
            />
          </Row>
        )}

        {(chrome.controls === 'mac' || searching) && (
          <Row title='Colores Mac' description='Paleta de las tres bolitas.' keywords='macColors classic graphite candy mono'>
            <div className='grid w-full grid-cols-2 gap-2'>
              {(Object.keys(MAC_TRAFFIC_PRESETS) as MacTrafficPreset[]).map(preset => (
                <PreviewCard
                  key={preset}
                  label={MAC_TRAFFIC_PRESETS[preset].label}
                  selected={chrome.macColors === preset}
                  onSelect={() => set('macColors', preset)}
                >
                  <MiniWindow controls='mac' side={chrome.controlsSide} macColors={preset} />
                </PreviewCard>
              ))}
            </div>
          </Row>
        )}

        <Row title='Densidad del header' description='Altura de la barra de título.' keywords='headerDensity header compact tall'>
          <PreferenceToggle
            value={chrome.headerDensity}
            options={['compact', 'comfortable', 'tall'] as const}
            onChange={v => set('headerDensity', v)}
            label={v => DENSITY_LABEL[v]}
            normal='comfortable'
          />
        </Row>

        <Row title='Tinte del header' description='Fondo de la barra superior.' keywords='headerTint tint'>
          <PreferenceToggle
            value={chrome.headerTint}
            options={['none', 'subtle', 'solid'] as const}
            onChange={v => set('headerTint', v)}
            label={v => TINT_LABEL[v]}
          />
        </Row>

        <Row title='Línea accent' description='Raya bajo el header.' keywords='headerAccent accent'>
          <PreferenceToggle
            value={chrome.headerAccent}
            options={[true, false] as const}
            onChange={v => set('headerAccent', v)}
          />
        </Row>

        <Row title='Estilo de tabs' description='Soft, underline o browser.' keywords='tabStyle tabs tab'>
          <PreferenceToggle
            value={chrome.tabStyle}
            options={['soft', 'underline', 'browser'] as const}
            onChange={v => set('tabStyle', v)}
            label={v => TAB_STYLE_LABEL[v]}
          />
        </Row>

        <Row title='Badge dirty' description='Puntito en tabs editados.' keywords='tabBadges badge dirty'>
          <PreferenceToggle
            value={chrome.tabBadges}
            options={[true, false] as const}
            onChange={v => set('tabBadges', v)}
          />
        </Row>

        <Row title='Botón +' description='Muestra el botón para agregar pestañas.' keywords='showTabAdd add tab'>
          <PreferenceToggle
            value={chrome.showTabAdd}
            options={[true, false] as const}
            onChange={v => set('showTabAdd', v)}
          />
        </Row>

        <Row
          title='Breadcrumb'
          description='Ruta del archivo activo en el sistema de archivos (solo lectura visual).'
          keywords='breadcrumb path ruta'
        >
          <PreferenceToggle
            value={chrome.breadcrumb}
            options={[true, false] as const}
            onChange={v => set('breadcrumb', v)}
          />
        </Row>

        {(chrome.breadcrumb || searching) && (
          <Row
            title='Separador del breadcrumb'
            description='Cómo se separan las carpetas del path del archivo.'
            keywords='breadcrumbSeparator separator'
          >
            <div className='grid w-full grid-cols-2 gap-2'>
              {BREADCRUMB_SEPARATORS.map(sep => (
                <PreviewCard
                  key={sep}
                  label={SEPARATOR_LABEL[sep]}
                  selected={chrome.breadcrumbSeparator === sep}
                  onSelect={() => set('breadcrumbSeparator', sep)}
                >
                  <BreadcrumbPreview separator={sep} />
                </PreviewCard>
              ))}
            </div>
          </Row>
        )}

        <Row title='Status bar' description='Franja inferior con cursor y líneas reales.' keywords='statusBar status barra'>
          <PreferenceToggle
            value={chrome.statusBar}
            options={[true, false] as const}
            onChange={v => set('statusBar', v)}
          />
        </Row>

        {(chrome.statusBar || searching) && (
          <Row title='Densidad status bar' description='Vista previa del contenido de la barra.' keywords='statusBarDensity'>
            <div className='grid w-full grid-cols-2 gap-2'>
              {STATUS_DENSITY.map(({ id, label, compact }) => (
                <PreviewCard
                  key={id}
                  label={label}
                  selected={chrome.statusBarDensity === id}
                  onSelect={() => set('statusBarDensity', id)}
                >
                  <StatusBarPreview compact={compact} />
                </PreviewCard>
              ))}
            </div>
          </Row>
        )}

        <Row title='Activity bar' description='Columna de iconos a la izquierda.' keywords='activityBar activity'>
          <PreferenceToggle
            value={chrome.activityBar}
            options={[true, false] as const}
            onChange={v => set('activityBar', v)}
          />
          {chrome.activityBar && (
            <div className='border-border/60 bg-muted/20 flex w-full items-center justify-center rounded-md border p-2'>
              <ActivityPreview />
            </div>
          )}
        </Row>

        {(chrome.activityBar || searching) && (
          <Row
            title='Orden del activity bar'
            description='Reordena los iconos. “Files” abre el explorer.'
            keywords='activityOrder order iconos'
          >
            <div className='border-border/60 bg-muted/20 flex w-full flex-col gap-1 rounded-md border p-2'>
              {activityOrder.map((id: ActivityIconId, index) => (
                <div
                  key={id}
                  className='bg-background/70 flex items-center justify-between gap-2 rounded-md px-2 py-1.5'
                >
                  <Text.emphasis className='leading-none'>{ACTIVITY_ICON_META[id].label}</Text.emphasis>
                  <div className='flex gap-0.5'>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      aria-label={`Subir ${id}`}
                      disabled={index === 0}
                      onClick={() => moveActivityIcon(id, 'up')}
                      className='size-7'
                    >
                      <ArrowUp className='size-3.5' />
                    </Button>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      aria-label={`Bajar ${id}`}
                      disabled={index === activityOrder.length - 1}
                      onClick={() => moveActivityIcon(id, 'down')}
                      className='size-7'
                    >
                      <ArrowDown className='size-3.5' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Row>
        )}

        <Row
          title='Sistema de archivos'
          description='Árbol interactivo. El ancho se ajusta arrastrando el borde del panel en el editor.'
          keywords='fileExplorer explorer archivos files'
        >
          <PreferenceToggle
            value={chrome.fileExplorer}
            options={[true, false] as const}
            onChange={v => set('fileExplorer', v)}
          />
        </Row>
      </div>
    </>
  )
}

export default WindowChromePreference
