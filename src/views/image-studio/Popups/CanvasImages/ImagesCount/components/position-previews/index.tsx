'use client'

import MiniBoxes from '@views/image-studio/Popups/CanvasImages/ImagesCount/components/MiniBoxes'
import type { FC } from 'react'

type PreviewProps = { active?: boolean; count: number }

export const GridPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='grid' />
export const StaggerPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='stagger' />
export const StackPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='stack' />
export const FanPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='fan' />
export const DiagonalPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='diagonal' />
export const ColumnPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='column' />
export const OrbitPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='orbit' />
