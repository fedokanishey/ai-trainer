import React from 'react'
import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <SignUp />
    </main>
  )
}

export default SignUpPage
