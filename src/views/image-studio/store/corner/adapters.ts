'use client'

import type { BorderConfigurationState } from '@views/image-studio/store/border/createBorderStore'
import useCornerStore, {
  createDefaultCornerConfig,
  type CornerRadiusConfig
} from '@views/image-studio/store/corner'
import type { IBorderRadiusStore } from '@views/image-studio/store/background/backgroundRadius.store'
import { useMemo } from 'react'

export const useCornerBorderAdapter = (tabId: string): BorderConfigurationState => {
  const border = useCornerStore(s => s.byTab[tabId]?.border ?? createDefaultCornerConfig().border)
  const patchBorder = useCornerStore(s => s.patchBorder)

  return useMemo(() => {
    const set = (patch: Partial<typeof border>) => patchBorder(tabId, patch)
    return {
      ...border,
      setColor: color => set({ color }),
      setSize: size => set({ size }),
      setGradient: gradient => set({ gradient }),
      setType: type => set({ type }),
      setFinish: finish => set({ finish }),
      setBlendMode: blendMode => set({ blendMode }),
      setMatEnabled: matEnabled => {
        if (!matEnabled) {
          set({ matEnabled: false })
          return
        }
        const hasInset = border.matTop + border.matRight + border.matBottom + border.matLeft > 0
        if (hasInset) {
          set({ matEnabled: true })
          return
        }
        set({
          matEnabled: true,
          matTop: 16,
          matRight: 16,
          matBottom: 16,
          matLeft: 16
        })
      },
      setMatColor: matColor => set({ matColor }),
      setMatSize: size => {
        const ratio = border.matTop > 0 ? border.matBottom / border.matTop : 1
        const bottom = ratio > 1.1 ? Math.round(size * ratio) : size
        set({
          matTop: size,
          matRight: size,
          matLeft: size,
          matBottom: bottom,
          matEnabled: size > 0
        })
      },
      setMatInsets: insets =>
        set({
          matTop: insets.top ?? border.matTop,
          matRight: insets.right ?? border.matRight,
          matBottom: insets.bottom ?? border.matBottom,
          matLeft: insets.left ?? border.matLeft,
          matEnabled:
            (insets.top ?? border.matTop) +
              (insets.right ?? border.matRight) +
              (insets.bottom ?? border.matBottom) +
              (insets.left ?? border.matLeft) >
            0
        }),
      resetBorder: () => patchBorder(tabId, createDefaultCornerConfig().border)
    }
  }, [border, patchBorder, tabId])
}

export const useCornerRadiusAdapter = (tabId: string): IBorderRadiusStore => {
  const radius = useCornerStore(s => s.byTab[tabId]?.radius ?? createDefaultCornerConfig().radius)
  const patchRadius = useCornerStore(s => s.patchRadius)

  return useMemo(() => {
    const set = (patch: Partial<CornerRadiusConfig>) => patchRadius(tabId, patch)
    return {
      ...radius,
      setActiveIndividualBorder: activeIndividualBorder => set({ activeIndividualBorder }),
      setBorderRadius: borderRadius => set({ borderRadius }),
      setBorderLTRadius: borderLTRadius => set({ borderLTRadius }),
      setBorderRTRadius: borderRTRadius => set({ borderRTRadius }),
      setBorderLBRadius: borderLBRadius => set({ borderLBRadius }),
      setBorderRBRadius: borderRBRadius => set({ borderRBRadius }),
      setBorderSmooth: borderSmooth =>
        set({ borderSmooth: Math.min(100, Math.max(0, borderSmooth)) }),
      getStyleBorderRadius: () => {
        if (!radius.activeIndividualBorder) return { borderRadius: `${radius.borderRadius}px` }
        return {
          borderRadius: `${radius.borderLTRadius}px ${radius.borderRTRadius}px ${radius.borderRBRadius}px ${radius.borderLBRadius}px`
        }
      }
    }
  }, [patchRadius, radius, tabId])
}
