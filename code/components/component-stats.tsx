"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ComponentUsage {
  name: string
  requests: number
  approved: number
}

export function ComponentStats() {
  const [stats, setStats] = useState<ComponentUsage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch all requests and components
      const { data: requestsData } = await supabase.from("requests").select("*")
      const { data: componentsData } = await supabase.from("components").select("*")

      // Build stats
      const statsMap: Record<string, { name: string; requests: number; approved: number }> = {}

      componentsData?.forEach((comp) => {
        statsMap[comp.id] = { name: comp.name, requests: 0, approved: 0 }
      })

      requestsData?.forEach((req) => {
        if (statsMap[req.component_id]) {
          statsMap[req.component_id].requests += 1
          if (req.status === "Approved") {
            statsMap[req.component_id].approved += 1
          }
        }
      })

      setStats(Object.values(statsMap))
      setLoading(false)
    }

    fetchStats()
  }, [supabase])

  if (loading) return <div>Loading statistics...</div>

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Component Usage Statistics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requests" fill="#3b82f6" name="Total Requests" />
            <Bar dataKey="approved" fill="#10b981" name="Approved" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Requests</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.reduce((sum, s) => sum + s.requests, 0)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-600 text-sm font-medium">Approved Requests</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.reduce((sum, s) => sum + s.approved, 0)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-600 text-sm font-medium">Components in Catalog</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.length}</p>
        </Card>
      </div>
    </div>
  )
}
