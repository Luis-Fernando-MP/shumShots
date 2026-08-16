interface IBoldText {
  text: string
}

const BoldText = ({ text }: IBoldText) => {
  const [normal, bold] = text.toString().split('/')
  return (
    <div className='flex flex-row items-end gap-[5px] uppercase'>
      <h3>{normal ?? ''}</h3>
      <h2 className='text-primary'>{bold ?? ''}</h2>
    </div>
  )
}

export default BoldText
