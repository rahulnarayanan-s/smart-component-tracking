import { AppProps } from 'next/app'
import { getSupabaseClient } from '../lib/supabase'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const supabase = getSupabaseClient()

  return <Component {...pageProps} supabase={supabase} />
}

export default MyApp