import Image from 'next/image'
import React from 'react'

const Credora = () => {
  return (
    <div className='w-full flex max-w-screen-2xl mx-auto flex-col items-center justify-center overflow-hidden px-5 md:px-14'>
      <Image src={"/credora.png"} alt='credora' height={200} width={800} className='select-none pointer-events-none'/>
    </div>
  )
}

export default Credora
