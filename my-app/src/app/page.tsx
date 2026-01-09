"use client"

import { useSession } from "next-auth/react"

function page() {
  const session = useSession()
  console.log(session.data?.user)
  return (
    <div>
      hello
    </div>
  )
}

export default page
