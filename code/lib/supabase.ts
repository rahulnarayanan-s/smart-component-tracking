import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      "https://qksjuwwxwvurlvsxudln.supabase.co", // your Supabase project URL
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrc2p1d3d4d3Z1cmx2c3h1ZGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzgzMjIsImV4cCI6MjA3Nzg1NDMyMn0.mOsOsUKgZg9YeSa7yu2Wpqp-DNhhbmeoNIkgiybn9F8" // your anon key
    )
  }
  return supabaseClient
}
