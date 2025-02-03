import { clerkClient } from '@clerk/nextjs/server'
import { checkRole } from '@/utils/roles'

export async function getUsers(query: string) {
  if (!checkRole('admin')) {
    throw new Error('Not Authorized')
  }

  const client = await clerkClient()

  let users: any[] = []
  let error = null

  if (query) {
    try {
      const response = await client.users.getUserList({ query })
      users = response.data
    } catch (err) {
      error = "An error occurred while fetching users. Please try again."
      console.error(err)
    }
  }

  return { users, error }
}