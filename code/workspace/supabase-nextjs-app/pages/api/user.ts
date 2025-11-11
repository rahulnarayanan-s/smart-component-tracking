import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseClient } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseClient()

  switch (req.method) {
    case 'GET':
      const { user } = await supabase.auth.getUser()
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: 'User not found' })
      }
      break

    case 'PUT':
      const { id, ...updates } = req.body
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)

      if (error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(200).json(data)
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}