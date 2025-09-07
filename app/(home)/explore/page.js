import Hero from '@/components/common/Hero'
import Explore from '@/components/home/Explore'
import React from 'react'

const ExplorePage = () => {
  const title = 'Explore Activity'
  return (
    <div className='flex flex-col p-4'>
      <Hero title={title} />
      <Explore /> 
    </div>
  )
}

export default ExplorePage