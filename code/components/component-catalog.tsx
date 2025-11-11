"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase"

interface Component {
  id: string
  name: string
  description: string
  total_quantity: number
  available_quantity: number
}

export function ComponentCatalog() {
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchComponents = async () => {
      const { data } = await supabase.from("components").select("*")
      setComponents(data || [])
      setLoading(false)
    }

    fetchComponents()

    const channel = supabase
      .channel("components-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "components",
        },
        () => {
          fetchComponents()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filteredComponents = components.filter(
    (comp) =>
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return "High"
    if (percentage > 20) return "Medium"
    return "Low"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "High":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) return <div>Loading components...</div>

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Components</h2>
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComponents.map((comp) => {
          const status = getAvailabilityStatus(comp.available_quantity, comp.total_quantity)
          return (
            <Card key={comp.id} className="p-4 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{comp.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{comp.description}</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available:</span>
                  <span className="font-semibold text-gray-900">{comp.available_quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-semibold text-gray-900">{comp.total_quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Availability:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(status)}`}>{status}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {components.length === 0 ? "No components available yet." : "No components match your search."}
        </div>
      )}
    </div>
  )
}
