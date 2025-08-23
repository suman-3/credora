import React, { Suspense } from 'react'
import VerifyPage from './_components/verify-page'
import { Metadata } from 'next';
import { siteConfig } from '@workspace/config/console/metadata';
import LoaderPage from '@/components/shared/loader-page';


export const metadata: Metadata = {
  title: {
    default: siteConfig.auth.verify.title,
    template: `%s - ${siteConfig.auth.verify.title}`,
  },
  description: siteConfig.auth.verify.description,
};

const VerificationPage = () => {

  
  return (
   <Suspense fallback={<LoaderPage />}>
     <VerifyPage />
   </Suspense>
  )
}

export default VerificationPage