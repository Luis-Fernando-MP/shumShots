import type { SizePreset } from '@views/image-studio/Popups/common/components/SizePresetsSection'

export const SLOT_SIZE_PRESETS = [
  { id: 'default', label: '4:3', width: 420, height: 315 },
  { id: 'square', label: '1:1', width: 360, height: 360 },
  { id: 'landscape', label: '16:9', width: 480, height: 270 },
  { id: 'photo', label: '3:2', width: 450, height: 300 },
  { id: 'portrait', label: '3:4', width: 315, height: 420 },
  { id: 'story', label: '9:16', width: 270, height: 480 },
  { id: 'wide', label: '21:9', width: 504, height: 216 }
] as const satisfies readonly SizePreset[]
