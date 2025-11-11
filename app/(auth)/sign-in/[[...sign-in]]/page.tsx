import React from 'react'
import { SignIn } from '@clerk/nextjs'

const SignedInPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <SignIn />
    </main>
  )
}

export default SignedInPage
