'use server'

import { revalidatePath } from 'next/cache'
import { connectToDB } from '../mongoose'
import Community from '../models/community.model'
import User from '../models/user.model'
import Thread from '../models/thread.model'

interface Params {
  text: string
  author: string
  communityId: string | null
  path: string
}

export async function createThread({ text, author, communityId, path }: Params) {
  try {
    connectToDB()

    const communityIdObject = await Community.findOne({ id: communityId }, { _id: 1 })

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    })

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    })

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      })
    }

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`)
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB()

  // calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: 'author',
      model: User,
    })
    .populate({
      path: 'community',
      model: Community,
    })
    .populate({
      path: 'children', // Populate the children field
      populate: {
        path: 'author', // Populate the author field within children
        model: User,
        select: '_id name parentId image', // Select only _id and username fields of the author
      },
    })

  const totalPostCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

  const posts = await postsQuery.exec()

  const isNext = totalPostCount > skipAmount + posts.length

  return { posts, isNext }
}
