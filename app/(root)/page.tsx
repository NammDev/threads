import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
      <p>Hello what sap</p>
      <UserButton afterSignOutUrl='/' />
    </div>
  )
}
