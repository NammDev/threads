import Link from 'next/link'
import Image from 'next/image'

interface Props {
  accountId: string
  authUserId: string
  name: string
  username: string
  imgUrl: string
  bio: string
  type?: string
}

function ProfileHeader({ accountId, authUserId, name, username, imgUrl, bio, type }: Props) {
  return (
    <div className='flex flex-col justify-start w-full'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative object-cover w-20 h-20'>
            <Image src={imgUrl} alt='logo' fill className='object-cover rounded-full shadow-2xl' />
          </div>

          <div className='flex-1'>
            <h2 className='text-left text-heading3-bold text-light-1'>{name}</h2>
            <p className='text-base-medium text-gray-1'>@{username}</p>
          </div>
        </div>
        {accountId === authUserId && type !== 'Community' && (
          <Link href='/profile/edit'>
            <div className='flex gap-3 px-4 py-2 rounded-lg cursor-pointer bg-dark-3'>
              <Image src='/assets/edit.svg' alt='logout' width={16} height={16} />

              <p className='text-light-2 max-sm:hidden'>Edit</p>
            </div>
          </Link>
        )}
      </div>

      <p className='max-w-lg mt-6 text-base-regular text-light-2'>{bio}</p>

      <div className='mt-12 h-0.5 w-full bg-dark-3' />
    </div>
  )
}

export default ProfileHeader
