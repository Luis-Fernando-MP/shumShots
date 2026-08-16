import { MonacoLanguage } from '@common/components/monaco/languages'
import Button from '@common/components/Button'
import { type FC, memo } from 'react'

interface Props {
  language: MonacoLanguage
  onClick: (language: MonacoLanguage) => void
  selected: boolean
}

const IconLanguage: FC<Props> = ({ language, onClick, selected }) => {
  const { Icon, language: lang } = language

  return (
    <Button
      size='icon'
      variant='soft'
      tooltip={lang}
      isSelected={selected}
      onClick={() => onClick(language)}
      aria-label={lang}
      className='size-10 [&_svg]:size-6'
    >
      <Icon />
    </Button>
  )
}

export default memo(IconLanguage)
