import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseClient } from '../../../lib/supabase'

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseClient()

  switch (req.method) {
    case 'POST':
      const { email, password } = req.body
      const { user, error } = await supabase.auth.signIn({ email, password })

      if (error) {
        return res.status(401).json({ error: error.message })
      }

      return res.status(200).json({ user })

    case 'DELETE':
      const { error: logoutError } = await supabase.auth.signOut()

      if (logoutError) {
        return res.status(500).json({ error: logoutError.message })
      }

      return res.status(204).end()

    default:
      res.setHeader('Allow', ['POST', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}