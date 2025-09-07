import ResetPasswordPage from '@/components/auth/SetPasswordPage'
import React from 'react'

const page = ({ params }) => {
  const { slug } = params;
  
  return (
   <ResetPasswordPage slug={slug} />
  )
}

export default page