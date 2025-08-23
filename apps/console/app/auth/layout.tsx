

import { Navbar } from '@/components/shared/navbar';
import { siteConfig } from '@workspace/config/console/metadata';
import { Metadata } from 'next';
import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.auth.title,
    template: `%s - ${siteConfig.auth.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
    <Navbar />
    <div className='w-full flex min-h-screen h-full items-center justify-center hero-bg'>
      {children}
    </div></>
  )
}

export default AuthLayout