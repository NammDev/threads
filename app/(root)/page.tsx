import ThreadCard from '@/components/cards/ThreadCard'
import { fetchPosts } from '@/lib/actions/thread.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { UserButton, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

type post = {
  _id: string
  currentUserId: string
  parentId: string
  text: string
  author: { name: string; image: string; id: string }
  community: { id: string; name: string; image: string }
  createdAt: string
  children: { author: { image: string } }[]
}

export default async function Home() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const result = await fetchPosts(1, 30)

  return (
    <>
      <h1 className='text-left head-text'>Home</h1>

      <section className='flex flex-col gap-10 mt-9'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      {/* <Pagination
        path='/'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      /> */}
    </>
  )
}
