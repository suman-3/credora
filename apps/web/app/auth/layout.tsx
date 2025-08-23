

import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='w-full flex min-h-screen h-full items-center justify-center hero-bg'>
      {children}
    </div>
  )
}

export default AuthLayout